import React from "react";
import { connect } from "react-redux";
import "./CellLabeler.less";

import { AppState, ContentRef, selectors, DocumentRecordProps } from "@nteract/core";
import { RecordOf } from "immutable";

interface ComponentProps {
  id: string;
  contentRef: ContentRef; // TODO: Make this per contentRef?
  children: React.ReactNode;
}

interface StateProps {
  cellIndex: number;
}

/**
 * Displays "Cell <index>"
 */
class CellLabeler extends React.Component<ComponentProps & StateProps> {
public override render() {
    return (
      <div className="CellLabeler">
        <div className="CellLabel">Cell {this.props.cellIndex + 1}</div>
        {this.props.children}
      </div>
    );
  }
}

const makeMapStateToProps = (state: AppState, ownProps: ComponentProps): ((state: AppState) => StateProps) => {
  const mapStateToProps = (state: AppState) => {
    const model = selectors.model(state, { contentRef: ownProps.contentRef });
    const cellOrder = selectors.notebook.cellOrder(model as RecordOf<DocumentRecordProps>);
    const cellIndex = cellOrder.indexOf(ownProps.id);

    return {
      cellIndex,
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps, undefined)(CellLabeler);
