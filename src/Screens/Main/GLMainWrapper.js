import React from 'react';
import ReactDOM from 'react-dom';
import GL from "golden-layout/dist/goldenlayout";
import FixtureGrid from "../FixtureGrid/FixtureGrid";
import HoistGrid from '../Hoists/HoistGrid';
import TrussGrid from '../Truss/TrussGrid';
import SocaList from '../SocaList/SocaList';
import DmxList from  '../DmxList/DmxList';
import ScaffGrid from '../Scaff/ScaffGrid';

import "../../Assets/CSS/goldenlayout-base.css";
import "../../Assets/CSS/goldenlayout-dark-theme.css";

window.React = React;
window.ReactDOM = ReactDOM;

let config = {
  content: [
    {
      type: "row",
      content: [
        {
          type: "stack",
          width: 60,
          content: [
            {
              type: "react-component",
              component: "FixtureGrid",
              title: "Fixtures",
            },
            {
              type: "row",
              title: "Cableplan",
              content: [
                {
                  type: "react-component",
                  component: "SocaList",
                  title: "Soca List"
                },
                {
                  type: "react-component",
                  component: "DmxList",
                  title: "DMX List"
                },

              ]
            },
            {
              type: "react-component",
              component: "TrussGrid",
              title: "Truss",
            },
            {
              type: "react-component",
              component: "HoistGrid",
              title: "Hoists",
            },
            {
              type: "react-component",
              component: "ScaffGrid",
              title: "Scaff",
            },

          ],
        },
      ],
    },
  ],
};

//var myLayout = new GoldenLayout(config);

// myLayout.registerComponent("testComponent", function () {});

// myLayout.init();

class GLMainWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    let self = this;
    setTimeout(() => {
      //self.createGoldenLayout(MainLayout, false);
      self.createGoldenLayout(config, false);
    }, 100);
  }

  wrapComponent(Component) {
    let self = this;
    class Wrapped extends React.Component {
      render() {
        return <Component {...self.props} />;
      }
    }
    return Wrapped;
  }

  async createGoldenLayout(layout, layOutChange) {
    let myLayoutTicket = new GL(layout);
    myLayoutTicket._isFullPage = true;
    
    myLayoutTicket.registerComponent("FixtureGrid", FixtureGrid );
    myLayoutTicket.registerComponent("HoistGrid", HoistGrid);
    myLayoutTicket.registerComponent("TrussGrid", TrussGrid);
    myLayoutTicket.registerComponent("SocaList", SocaList);
    myLayoutTicket.registerComponent("DmxList", DmxList);
    myLayoutTicket.registerComponent("ScaffGrid", ScaffGrid);
    myLayoutTicket.init();
  }

  render() {
    return (
      <div className={`fixtureView`} ref={(input) => (this.layout = input)} />
    );
  }
}

export default GLMainWrapper;
