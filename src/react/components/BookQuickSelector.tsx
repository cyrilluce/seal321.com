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
const bookQuickSelects = {
  "融合书(G篇)": {
    // "1": 5359,
    // "2": 5360,
    // "3": 5361,
    "4": 5362,
    "5": 5363,
    "6": 5364,
    "7": 5365,
    "8": 5366,
    "9": 5367,
    "10": 5368,
    "11": 5369,
    "12": 5370,
    "13": 5371,
    "14": 5372,
    "15": 5373,
    "16": 5374,
    "17": 5375,
    "18": 5376,
    "19": 5377,
    "20": 5378,
    特别篇: 11840,
    精灵1: 15587,
    精灵2: 15588,
    精灵3: 15589,
    精灵4: 15590,
    精灵5: 15591
  },
  "融合書(命中增加型)": {
    // "1": 5379,
    // "2": 5380,
    // "3": 5381,
    "4": 5382,
    "5": 5383,
    "6": 5384,
    "7": 5385,
    "8": 5386,
    "9": 5387,
    "10": 5388,
    "11": 5389,
    "12": 5390,
    "13": 5391,
    "14": 5392,
    "15": 5393,
    "16": 5394,
    "17": 5395,
    "18": 5396,
    "19": 5397,
    "20": 5398
  },
  "融合書(必殺增強型)": {
    // "1": 5759,
    // "2": 5760,
    // "3": 5761,
    "4": 5762,
    "5": 5763,
    "6": 5764,
    "7": 5765,
    "8": 5766,
    "9": 5767,
    "10": 5768,
    "11": 5769,
    "12": 5770,
    "13": 5771,
    "14": 5772,
    "15": 5773,
    "16": 5774,
    "17": 5775,
    "18": 5776,
    "19": 5777,
    "20": 5778
  },
  "融合書(攻擊速度型)": {
    // "1": 5779,
    // "2": 5780,
    // "3": 5781,
    "4": 5782,
    "5": 5783,
    "6": 5784,
    "7": 5785,
    "8": 5786,
    "9": 5787,
    "10": 5788,
    "11": 5789,
    "12": 5790,
    "13": 5791,
    "14": 5792,
    "15": 5793,
    "16": 5794,
    "17": 5795,
    "18": 5796,
    "19": 5797,
    "20": 5798
  }
};

@onClickOutside
export default class BookQuickSelector extends React.PureComponent<Props, {}> {
  handleClickOutside(e: MouseEvent) {
    this.props.onSelect(0);
  }
  render() {
    const { onSelect } = this.props;
    return (
      <div>
        {Object.keys(bookQuickSelects).map(key =>
          <div key={key}>
            <h4>{key}</h4>
            <div className="btn-group ">
              {Object.keys(bookQuickSelects[key]).map(name =>
                <button
                  key={name}
                  type="button"
                  className="btn btn-default"
                  onClick={() => {
                    onSelect(bookQuickSelects[key][name]);
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
