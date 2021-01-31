import React from "react";
import { isBrumStyle } from "../../../../Utils/fixtureGridTools";
import { CIRCUIT_TYPE_DIM, CIRCUIT_TYPE_HOT } from "../../../../Utils/constants";

const parsePatch = (patch, delimiter) => {
  if (patch.includes(delimiter)) {
    const splits = patch.split(delimiter);
    const universe = parseInt(splits[0]);
    const address = parseInt(splits[1]);
    if (!universe.isNaN && !address.isNaN) {
      return { universe, address };
    }
  }
  return null;
};

export const calculatePower = (rows, dimmerAddressAndUniverse) => {
  return new Promise((resolve, reject) => {
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;

    rows.forEach((node) => {
      let circuitNumber = 0;

      // Get circuit type from circuitType, or from brumStyle notation, or nothing..

      let circuitType = 0;
      if ("circuitType" in node) {
        circuitType = node.circuitType;
      } else if (isBrumStyle(node.circuitName)) {
        circuitType = isBrumStyle(node.circuitName).typeAsNumber;
      }

      // Extract power from data:
      let rawWattage = node.wattage;
      let wattage = 0;
      if (rawWattage.indexOf("W") !== -1) {
        // We have a W in our wattage
        wattage = parseInt(rawWattage.substring(0, rawWattage.indexOf("W")));
      } else if (rawWattage.indexOf("w") !== -1) {
        // We have a w in our wattage
        wattage = parseInt(rawWattage.substring(0, rawWattage.indexOf("W")));
      } else {
        // We have no W or w
        wattage = parseInt(rawWattage);
      }

      // Something went wrong. Wattage is not a number
      if (Number.isNaN(wattage)) reject("Not a number");

      // Be sure that this is a valid circuitType
      if (circuitType === CIRCUIT_TYPE_HOT || circuitType === CIRCUIT_TYPE_DIM) {
        // HOT POWER
        if (circuitType === CIRCUIT_TYPE_HOT) {
          circuitNumber = parseInt(node.circuitNumber);
          if (Number.isNaN(circuitNumber)) reject("Not a number");
        }

        // DIM POWER
        if (circuitType === CIRCUIT_TYPE_DIM) {
          // Hard coded values for dimmer for testing
          /// TODO: Get these from redux or what not..
          const startAddress = dimmerAddressAndUniverse.address;
          const universe = dimmerAddressAndUniverse.universe;
          const numberOfChannels = dimmerAddressAndUniverse.numberOfChannels;

          // Get address and universe from the current fixture
          const dmx = parsePatch(node.patch, ".");

          // Correct universe
          if (dmx.universe === universe) {
            // Within the range of the dimmer
            if (dmx.address < startAddress + numberOfChannels && dmx.address >= startAddress) {
              const dimmerChannel = dmx.address - startAddress;
              const dimmerChannelAsCircuitNumber = (dimmerChannel % 6) + 1;

              circuitNumber = dimmerChannelAsCircuitNumber;
            }
          }
        }

        if ("phaseSequ" in node && node.phaseSequ) {
          const phaseSequ = node.phaseSequ;
          if (phaseSequ.length === 6) {
            // If there is 6 letters in phase sequenc
            const phase = parseInt(phaseSequ.charAt(circuitNumber - 1));

            // If the phase is valid. E.g: 1,2 or 3.
            if (phase === 1) {
              p1 += wattage;
            }
            if (phase === 2) {
              p2 += wattage;
            }
            if (phase === 3) {
              p3 += wattage;
            }
          }
        } else {
          if (circuitNumber === 1 || circuitNumber === 4) {
            p1 += wattage;
          } else if (circuitNumber === 2 || circuitNumber === 5) {
            p2 += wattage;
          } else if (circuitNumber === 3 || circuitNumber === 6) {
            p3 += wattage;
          }
        }
      }else{
        reject("Missing circuit type")
      }
    });

    let total = p1 + p2 + p3;

    let power = {
      phase1: p1,
      phase2: p2,
      phase3: p3,
      total,
      phase1Frac: ((p1 / total) * 100).toFixed(0),
      phase2Frac: ((p2 / total) * 100).toFixed(0),
      phase3Frac: ((p3 / total) * 100).toFixed(0),
    };
    resolve(power);
  });
};

export const printPower = (p) => {

  let power = p; 

  for(let entry in power){
    const value = power[entry]; 
    if(isNaN(value)){
      power[entry] = 0; 
    }
  }

  return (
    <div>
      <ul>
        <li>
          L1: <b>{power.phase1} W</b> ({power.phase1Frac}%)
        </li>
        <li>
          L2: <b>{power.phase2} W</b> ({power.phase2Frac}%)
        </li>
        <li>
          L3: <b>{power.phase3} W</b> ({power.phase3Frac}%)
        </li>
        <li>
          Total: <b>{power.total} W</b>
        </li>
      </ul>
    </div>
  );
};
