const React = require('react');
const { connect } = require('react-redux');
const { Table, Column, Cell } = require('fixed-data-table');

class SessionTable extends React.Component {
    constructor(props) {
        super(props);

        const { sessionType } = props;

        const columnWidths = {
            index: 50,
            url: 900,
            action: 55,
            from: 105
        };

        if(sessionType === "front") {
            columnWidths.serviceCode = 105;
        }

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

    calcCellClass(props) {
        const isFuse = this.props.sessionData[props.rowIndex].isFuse;

        if(isFuse === true) {
            return "cell_fused";
        } else if(isFuse === false) {
            return "cell_passed";
        }
    }

    onScrollStart(scrollX, scrollY) {
        this.setState({
            isScrollEnd: false
        });
    }

    onScrollEnd(scrollX, scrollY) {
        const rowsCount = this.props.sessionData.length;
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

    calcIndexOfScrollToRow(sessionData) {
        let indexOfScrollToRow = sessionData.length;

        if(!this.state.isScrollEnd) {
            indexOfScrollToRow = undefined;
        }

        return indexOfScrollToRow;
    }

    calcCellAction(props) {
        const isFuse = this.props.sessionData[props.rowIndex].isFuse;

        if(isFuse === true) {
            return <i className="fa fa-remove"/>;
        } else if(isFuse === false) {
            return <i className="fa fa-check"/>;
        } else {
            return <i className="fa fa-spinner fa-pulse"/>;
        }
    }

    onRowClick(sessionData, onRowClick, proxy, index) {
        // console.log(sessionData[index]);
        //onRowClick(sessionData[index].url, sessionData[index].frame);
    }

    render() {
        const { sessionData, sessionType, onRowClick } = this.props;
        const { columnWidths, height, rowHeight, headerHeight, width, allowCellsRecycling } = this.state;
        const indexOfScrollToRow = this.calcIndexOfScrollToRow(sessionData);

        return (
            <Table
                rowsCount={sessionData.length}
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
                onRowClick={this.onRowClick.bind(this, sessionData, onRowClick)}
            >
                <Column
                    columnKey="index"
                    header={<Cell>#</Cell>}
                    align="center"
                    cell={props => (
                        <Cell {...props} className={this.calcCellClass(props)}>
                            {props.rowIndex+1}
                        </Cell>
                    )}
                    width={columnWidths.index}
                />
                <Column
                    columnKey="url"
                    header={<Cell>Url</Cell>}
                    cell={props => (
                        <Cell {...props} className={this.calcCellClass(props)}>
                            {sessionData[props.rowIndex].url}
                        </Cell>
                    )}
                    width={columnWidths.url}
                    isResizable={true}
                />
                <Column
                    columnKey="action"
                    header={<Cell>Action</Cell>}
                    align="center"
                    cell={props => (
                        <Cell {...props} className={this.calcCellClass(props)}>
                            {this.calcCellAction(props)}
                        </Cell>
                    )}
                    width={columnWidths.action}
                />
                <Column
                    columnKey="from"
                    header={<Cell>From</Cell>}
                    align="center"
                    cell={props => (
                        <Cell {...props} className={this.calcCellClass(props)}>
                            {sessionData[props.rowIndex].remoteAddress}
                        </Cell>
                    )}
                    width={columnWidths.from}
                />
                {
                    sessionType === "front" ?
                        <Column
                            columnKey="serviceCode"
                            header={<Cell>ServiceCode</Cell>}
                            align="center"
                            cell={props => (
                                <Cell {...props} className={this.calcCellClass(props)}>
                                    {sessionData[props.rowIndex].serviceCode}
                                </Cell>
                            )}
                            width={columnWidths.serviceCode}
                        /> : ""
                }
            </Table>
        );
    }
}

module.exports = { SessionTable };
