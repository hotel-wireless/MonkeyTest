const React = require('react');
const { connect } = require('react-redux');
const { Table, Column, Cell } = require('fixed-data-table');

class NetCheckTable extends React.Component {
    constructor(props) {
        super(props);

        const columnWidths = {
            index: 50,
            source: 220,
            destination: 220,
            description: 450
        };

        this.state = {
            columnWidths,
            isScrollEnd: true,
            height: 700,
            rowHeight: 30,
            headerHeight: 40,
            width: 1300,
            allowCellsRecycling: true
        };

        this.onColumnResizeEnd = this.onColumnResizeEnd.bind(this);
        this.onScrollStart = this.onScrollStart.bind(this);
        this.onScrollEnd = this.onScrollEnd.bind(this);
    }

    onScrollStart(scrollX, scrollY) {
        this.setState({
            isScrollEnd: false
        });
    }

    onScrollEnd(scrollX, scrollY) {
        const rowsCount = this.props.netcheckData.length;
        const { height, rowHeight, headerHeight } = this.state;

        this.setState({
            isScrollEnd: rowHeight * rowsCount + headerHeight - height - scrollY <= 0
        });
    }

    onColumnResizeEnd(newColumnWidth, columnKey) {
        this.setState(({columnWidths}) => ({
            columnWidths: {
                ...columnWidths,
                [columnKey]: newColumnWidth
            }
        }));
    }

    calcIndexOfScrollToRow(netcheckData) {
        let indexOfScrollToRow = netcheckData.length;

        if(!this.state.isScrollEnd) {
            indexOfScrollToRow = undefined;
        }

        return indexOfScrollToRow;
    }

    render() {
        const { netcheckData } = this.props;
        const { columnWidths, height, rowHeight, headerHeight, width, allowCellsRecycling } = this.state;
        const indexOfScrollToRow = this.calcIndexOfScrollToRow(netcheckData);

        return (
            <Table
                rowsCount={netcheckData.length}
                scrollToRow={indexOfScrollToRow}
                onScrollStart={this.onScrollStart}
                onScrollEnd={this.onScrollEnd}
                rowHeight={rowHeight}
                headerHeight={headerHeight}
                width={width}
                height={height}
                allowCellsRecycling={allowCellsRecycling}
                isColumnResizing={false}
                onColumnResizeEndCallback={this.onColumnResizeEnd}
            >
                <Column
                    columnKey="index"
                    header={<Cell>#</Cell>}
                    align="center"
                    cell={props => (
                        <Cell {...props}>
                            {props.rowIndex+1}
                        </Cell>
                    )}
                    width={columnWidths.index}
                />
                <Column
                    columnKey="source"
                    header={<Cell>Source</Cell>}
                    align="center"
                    cell={props => (
                        <Cell {...props}>
                            {netcheckData[props.rowIndex].source}
                        </Cell>
                    )}
                    width={columnWidths.source}
                    isResizable={true}
                />
                <Column
                    columnKey="destination"
                    header={<Cell>Destination</Cell>}
                    align="center"
                    cell={props => (
                        <Cell {...props}>
                            {netcheckData[props.rowIndex].destination}
                        </Cell>
                    )}
                    width={columnWidths.destination}
                />
                <Column
                    columnKey="description"
                    header={<Cell>Description</Cell>}
                    align="center"
                    cell={props => (
                        <Cell {...props}>
                            {netcheckData[props.rowIndex].description}
                        </Cell>
                    )}
                    width={columnWidths.description}
                />
            </Table>
        );
    }
}

module.exports = { NetCheckTable };
