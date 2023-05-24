import React from "react";
import { Component, PropTypes } from "react";
import { inject, observer } from "mobx-react";
import { Version as VersionModel } from "../../models";
import { dbs, ServerId } from "../../config";
import classnames from "classnames";
import onClickOutside from "react-onclickoutside/decorator";

interface Props {
  onSelect: (itemId: number) => void;
}

function heidiDataToJson(list) {
  return JSON.stringify(
    list.reduce((m, o, i) => (m[i + 1] = o.id) && m, {}),
    null,
    "\t"
  );
}

/** 制作书快速选择 */
const assistQuickSelects = {
  "常用G辅": {
    "粉红钻石": 3981,
    "50G": 2282,
    "57G": 2284,
    "75G": 2288,
    "130 G头": 461,
    "130 G上": 531,
    "130 G下": 442,
    "130 G鞋": 522,
    "130 DG头": 1602,
    "130 DG上": 1542,
    "130 DG下": 1822,
    "130 DG鞋": 1722,
    "130 XG头": 1612,
    "130 XG上": 1552,
    "130 XG下": 1832,
    "130 XG鞋": 1732,
    "180防具": 8614
  }
};

@onClickOutside
export default class AssistQuickSelector extends React.PureComponent<Props, {}> {
  handleClickOutside(e: MouseEvent) {
    this.props.onSelect(0);
  }
  render() {
    const { onSelect } = this.props;
    return (
      <div>
        {Object.keys(assistQuickSelects).map(key =>
          <div key={key}>
            <h4>{key}</h4>
            <div className="btn-group ">
              {Object.keys(assistQuickSelects[key]).map(name =>
                <button
                  key={name}
                  type="button"
                  className="btn btn-default"
                  onClick={() => {
                    onSelect(assistQuickSelects[key][name]);
                  }}
                >
                  {name}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    );
  }
}
