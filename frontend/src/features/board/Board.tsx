import React from "react";
import styled from "@emotion/styled";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DraggableLocation,
  DropResult
} from "react-beautiful-dnd";
import Column from "features/column";
import { IColumn } from "types";
import reorder, { reorderTasks } from "utils/reorder";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import { updateTasksByColumn } from "features/task/TaskSlice";
import { updateColumns, columnSelectors } from "features/column/ColumnSlice";
import { useParams } from "react-router-dom";
import { fetchBoardById } from "./BoardSlice";
import Spinner from "components/Spinner";
import { barHeight, sidebarWidth } from "const";
import PageError from "components/PageError";

const ParentContainer = styled.div<{ height: string }>`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  min-height: calc(100vh - ${barHeight * 2}px);
  min-width: calc(100vw - ${sidebarWidth});
  display: inline-flex;
  overflow-x: scroll;
  width: 100%;
`;

const EmptyBoard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

interface Props {
  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  containerHeight?: string;
}

const Board = ({
  containerHeight,
  isCombineEnabled,
  withScrollableColumns
}: Props) => {
  const detail = useSelector((state: RootState) => state.board.detail);
  const error = useSelector((state: RootState) => state.board.detailError);
  const columns = useSelector(columnSelectors.selectAll);
  const tasksByColumn = useSelector((state: RootState) => state.task.byColumn);
  const tasksById = useSelector((state: RootState) => state.task.byId);
  const dispatch = useDispatch();
  const { id } = useParams();

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBoardById(id));
    }
  }, [id]);

  const onDragEnd = (result: DropResult) => {
    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering column
    if (result.type === "COLUMN") {
      const newOrdered: IColumn[] = reorder(
        columns,
        source.index,
        destination.index
      );
      dispatch(updateColumns(newOrdered));
      return;
    }

    const data = reorderTasks({
      tasksByColumn,
      source,
      destination
    });
    dispatch(updateTasksByColumn(data.tasksByColumn));
  };

  const board = (
    <Droppable
      droppableId="board"
      type="COLUMN"
      direction="horizontal"
      ignoreContainerClipping={Boolean(containerHeight)}
      isCombineEnabled={isCombineEnabled}
    >
      {(provided: DroppableProvided) => (
        <Container ref={provided.innerRef} {...provided.droppableProps}>
          {columns.map((column: IColumn, index: number) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              index={index}
              tasks={tasksByColumn[column.id].map(taskId => tasksById[taskId])}
              isScrollable={withScrollableColumns}
              isCombineEnabled={isCombineEnabled}
            />
          ))}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );

  const detailDataExists = detail?.id.toString() === id;

  if (!detailDataExists) {
    return <Spinner loading={!detailDataExists} />;
  }

  if (error) {
    return <PageError>{error}</PageError>;
  }

  if (columns.length === 0) {
    return <EmptyBoard>This board is empty.</EmptyBoard>;
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {containerHeight ? (
          <ParentContainer height={containerHeight}>{board}</ParentContainer>
        ) : (
          <>{board}</>
        )}
      </DragDropContext>
    </>
  );
};

export default Board;
