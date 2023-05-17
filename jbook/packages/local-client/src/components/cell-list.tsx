import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell';
import { Fragment, useEffect } from 'react';
import './cell-list.css'
import { useActions } from '../hooks/use-actions';

const CellList: React.FC = () => {
  // used to get the type of the redux store
  // this is how we get the redux state/store
  // const store = useTypedSelector((state) => state);

  // destructure the data we want from the redux store
  // then map through the order array and add the cell data
  // the selector is a way to get drived state from the redux store
  // meaning the data is dependent on the cells state
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );
  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem key={cell.id} cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className='cell-list'>
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
