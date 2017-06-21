import * as React from "react";
import { Component, PropTypes } from "react";
import { autorun } from "mobx";
import { inject, observer } from "mobx-react";
import { Gateway } from "react-gateway";
import { ItemDbStore } from "../../stores";
import { findDOMNode } from "react-dom";
import { dbs, ServerId, crystalPoint } from "../../config";
import { ServerNames } from "../../lang";
import { Item as IItem } from "../../types";
import { Item as ItemModel } from "../../models";
import Dropdown from "./Dropdown";
import ItemWidget from "./Item";
import ItemSlot from "./ItemSlot";
import BookQuickSelector from "./BookQuickSelector";
import AssistQuickSelector from "./AssistQuickSelector";

interface Props {
  store?: ItemDbStore;
}

interface State {
  detailMode?: boolean;
  /** 快速选择制作书 */
  quickSelectBook?: boolean;
  /** 快速选择G辅 */
  quickSelectAssist?: number;
}
/**
 * 将数字转换为千分制
 */
function humanizeNumber(
  num: number,
  len: number = 3,
  splitter: string = ","
): string {
  const str = num.toFixed(0);
  const parts = [];
  for (let i = str.length % len || len, start = 0; i <= str.length; i += len) {
    parts.push(str.slice(start, i));
    start = i;
  }
  return parts.join(splitter);
}

const splitter = "-------------------------------";

@inject("store")
@observer
export default class GSimulate extends Component<Props, State> {
  render() {
    const { store } = this.props;
    if (!store.gSimulateVisible) {
      return null;
    }
    const gSimulate = store.gSimulate;
    const itemDetail = store.itemModel;
    const {
      detailMode = false,
      quickSelectBook = false,
      quickSelectAssist = -1
    } =
      this.state || {};

    let lastIdHook, lastLevelHook;
    const makeViewItem = (itemModel: ItemModel) => {
      return (item: IItem) => {
        store.viewItem(itemModel.data, itemModel.addLevel);
        lastIdHook = autorun(() => {
          itemDetail.id;
          lastIdHook && lastIdHook();
          lastLevelHook && lastLevelHook();
        });
        lastLevelHook = autorun(() => {
          itemModel.addLevel = itemDetail.addLevel;
        });
      };
    };

    const targetInvalid = gSimulate.targetInvalid;

    return (
      <div className="row gsim">
        {quickSelectBook &&
          <Gateway into="global">
            <div className="quick-selector center-block well">
              <BookQuickSelector
                onSelect={id => {
                  id && gSimulate.setBookId(id);
                  this.setState({ quickSelectBook: false });
                }}
              />
            </div>
          </Gateway>}
        {quickSelectAssist > -1 &&
          <Gateway into="global">
            <div className="quick-selector center-block well">
              <AssistQuickSelector
                onSelect={id => {
                  id && gSimulate.setAssistItemId(quickSelectAssist, id);
                  this.setState({ quickSelectAssist: -1 });
                }}
              />
            </div>
          </Gateway>}
        <div className="col-md-6 col-sm-9 col-xs-12">
          <div className="panel panel-default">
            <div className="panel-body">
              <div className="row">
                <div className="col-xs-12">
                  <span className="gsim-cost">
                    制作费 {humanizeNumber(gSimulate.cost)}
                  </span>
                  <span className="gsim-rate">
                    成功率 {gSimulate.percentage.toFixed(3)}%{gSimulate.skillWork
                      ? `(匠师:${gSimulate.skillPercentage.toFixed(3)}%)`
                      : ""}
                  </span>
                  <a
                    href="javascript:;"
                    onClick={() => {
                      this.setState({ detailMode: !detailMode });
                    }}
                  >
                    {detailMode ? "隐藏文字版" : "显示文字版"}
                  </a>
                </div>
              </div>
              <div className="row slot-row">
                <div className="col-xs-12">
                  <ItemSlot
                    onRightClick={makeViewItem(gSimulate.book)}
                    quickSelect={() => this.setState({ quickSelectBook: true })}
                    onDragAway={() => gSimulate.book.setId(0)}
                    data={gSimulate.book}
                    canAccept={item => !gSimulate.tryBookItem(item.data)}
                    accept={item => gSimulate.setBookItem(item.data)}
                  />
                  <div className="gsim-splitter" />
                  {[0, 1, 2, 3, 4].map(
                    index =>
                      gSimulate.needs[index].data &&
                      <div key={index} className="gsim-need">
                        <span className="gsim-need-num">
                          {gSimulate.craft.data &&
                            gSimulate.craft.data[`num${index + 1}`]}
                        </span>
                        <ItemWidget
                          onRightClick={makeViewItem(gSimulate.needs[index])}
                          loc={gSimulate.loc}
                          data={gSimulate.needs[index].data}
                        />
                      </div>
                  )}
                  <div className="gsim-splitter">
                    <span className="glyphicon glyphicon-chevron-right" />
                  </div>
                  <div className="gsim-splitter gsim-result">
                    {gSimulate.result.data
                      ? <ItemWidget
                          onRightClick={makeViewItem(gSimulate.result)}
                          loc={gSimulate.loc}
                          data={gSimulate.result.data}
                        />
                      : <span className="glyphicon glyphicon-question-sign" />}
                  </div>
                </div>
              </div>
              <div className="row slot-row">
                <div className="col-xs-12">
                  <ItemSlot
                    onRightClick={makeViewItem(gSimulate.target)}
                    onDragAway={() => gSimulate.target.setId(0)}
                    disabled={!gSimulate.craft.isGTSC}
                    data={gSimulate.target}
                    className={targetInvalid ? "gsim-slot-invalid" : ""}
                    title={targetInvalid}
                    canAccept={item => !gSimulate.tryTargetItem(item.data)}
                    accept={item => gSimulate.setTargetItem(item.data)}
                  >
                    {gSimulate.target.data &&
                      gSimulate.target.addLevel > 0 &&
                      <span className="gsim-slot-level">
                        +{gSimulate.target.addLevel}
                      </span>}
                    {gSimulate.target.data &&
                      <div className="btn-group btn-group-vertical btn-group-xs add-level-tools">
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={(e) => {
                            gSimulate.target.setAddLevel(
                              gSimulate.target.addLevel + 1
                            );
                            e.stopPropagation()
                          }}
                        >
                          <span className="glyphicon glyphicon-plus"> </span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={(e) => {
                            gSimulate.target.setAddLevel(
                              gSimulate.target.addLevel - 1
                            );
                            e.stopPropagation()
                          }}
                        >
                          <span className="glyphicon glyphicon-minus"> </span>
                        </button>
                      </div>}
                  </ItemSlot>
                  <div className="gsim-splitter" />
                  {gSimulate.assists.map((assist, index) =>
                    <ItemSlot
                      onRightClick={makeViewItem(assist)}
                      quickSelect={() =>
                        this.setState({ quickSelectAssist: index })}
                      key={index}
                      onDragAway={() => assist.setId(0)}
                      disabled={
                        !gSimulate.craft.data ||
                        index >= gSimulate.craft.data.fieldnum
                      }
                      data={assist}
                      className={
                        gSimulate.assistInvalids[index]
                          ? "gsim-slot-invalid"
                          : ""
                      }
                      title={gSimulate.assistInvalids[index]}
                      canAccept={item =>
                        !gSimulate.tryAssistItem(index, item.data)}
                      accept={item => gSimulate.setAssistItem(index, item.data)}
                    >
                      {assist.data &&
                        assist.addLevel > 0 &&
                        <span className="gsim-slot-level">
                          +{assist.addLevel}
                        </span>}
                      {assist.data &&
                        <div className="btn-group btn-group-xs btn-group-vertical add-level-tools">
                          <button
                            type="button"
                            className="btn btn-default"
                            onClick={(e) => {
                              assist.setAddLevel(assist.addLevel + 1);
                              e.stopPropagation()
                            }}
                          >
                            <span className="glyphicon glyphicon-plus"> </span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-default"
                            onClick={(e) => {
                              assist.setAddLevel(assist.addLevel - 1);
                              e.stopPropagation()
                            }}
                          >
                            <span className="glyphicon glyphicon-minus"> </span>
                          </button>
                        </div>}
                    </ItemSlot>
                  )}
                </div>
              </div>
              <div className="row slot-row">
                <div className="col-xs-12">
                  <div className="gsim-invalid">{gSimulate.invalid || " "}</div>
                </div>
              </div>
              {detailMode &&
                <div className="row gsim-detail">
                  <div className="col-xs-12">
                    <div className="well well-xs">
                      <p>
                        分享：<a
                          href={`/${store.loc}/db?gsim=${store.queryParams
                            .gsim || ""}`}
                        >
                          {`https://beta.seal321.com/${store.loc}/db?gsim=${store
                            .queryParams.gsim}`}
                        </a>
                      </p>
                      <p>希尔特国家地理 物品数据库 v2.0 Beta 制作模拟结果</p>
                      {store.version.data &&
                        <p>
                          版本：[{ServerNames[store.loc]}/item_{store.version.data["item"].version}/craft_{store.version.data["craft"].version}/{store.version.newest.time.toISOString().slice(0, 10)}]
                        </p>}
                      <p>{splitter}</p>
                      <p>
                        制作书：{gSimulate.book.data
                          ? gSimulate.book.data.name
                          : "-"}
                      </p>
                      <p>
                        {gSimulate.craft.isGTSC ? "要合成的装备" : "必要物品"}：{gSimulate.target.data ? gSimulate.target.data.name : "-"}
                      </p>
                      <p>
                        合成结果：{gSimulate.result.data
                          ? gSimulate.result.data.name
                          : "-"}
                      </p>

                      <p>{splitter}</p>

                      <p>基础成功率：{gSimulate.basePercentage.toFixed(3)}%</p>
                      <p>共需PT：{(gSimulate.needPt / crystalPoint).toFixed(2)}</p>

                      <p>{splitter}</p>

                      <p>辅助列表（共计{gSimulate.hasPt / crystalPoint}PT）</p>
                      {gSimulate.assists
                        .filter(assist => assist.data)
                        .map((assist, index) =>
                          <p key={index}>
                            {assist.data.name}
                            {assist.addLevel
                              ? `+${assist.addLevel}`
                              : ""} [{assist.pt / crystalPoint}]
                          </p>
                        )}

                      <p>{splitter}</p>

                      <p>
                        成功率：{gSimulate.percentage.toFixed(3)}%
                        {" "}
                        {gSimulate.percentage > gSimulate.limitRate * 100
                          ? "(溢出)"
                          : ""}
                      </p>
                      <p>
                        {gSimulate.skillWork
                          ? `匠师：${gSimulate.skillPercentage.toFixed(
                              3
                            )}% (加成${gSimulate.skillRate *
                              100}%) ${gSimulate.skillPercentage >
                              gSimulate.limitRate * 100
                              ? "(溢出)"
                              : ""}`
                          : `匠师技能无加成`}
                      </p>
                      <p>成功率上限：{gSimulate.limitRate * 100}%</p>

                      <p>{splitter}</p>

                      <p>必需材料：</p>
                      {gSimulate.craft.data &&
                        <p>
                          {gSimulate.needs
                            .filter(need => need.data)
                            .map((need, index) =>
                              <span key={index} className="gsim-detail-need">
                                {need.data.name}*{gSimulate.craft.data[`num${index + 1}`]}&nbsp;
                              </span>
                            )}
                        </p>}
                    </div>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
