export function circuitComparator(input1, input2) {
  let circuit1 = isBrumStyle(input1);
  let circuit2 = isBrumStyle(input2);

  if (circuit1 === null && circuit2 === null) {
    return 0;
  }
  if (circuit1 === null) {
    return -1;
  }
  if (circuit2 === null) {
    return 1;
  }

  let value1 =
    circuit1.typeAsNumber * 100000 +
    circuit1.dc * 10000 +
    circuit1.pdu * 1000 +
    circuit1.socaNumber * 10 +
    circuit1.circuitNumber;
  let value2 =
    circuit2.typeAsNumber * 100000 +
    circuit2.dc * 10000 +
    circuit2.pdu * 1000 +
    circuit2.socaNumber * 10 +
    circuit2.circuitNumber;

  return value1 - value2;
}

export function circuitNameComparator(input1, input2) {
  let circuit1 = isBrumStyle(input1);
  let circuit2 = isBrumStyle(input2);

  if (circuit1 === null && circuit2 === null) {
    return 0;
  }
  if (circuit1 === null) {
    return -1;
  }
  if (circuit2 === null) {
    return 1;
  }

  let value1 =
    circuit1.typeAsNumber * 100000 +
    circuit1.dc * 10000 +
    circuit1.pdu * 1000 +
    circuit1.socaNumber * 10;

  let value2 =
    circuit2.typeAsNumber * 100000 +
    circuit2.dc * 10000 +
    circuit2.pdu * 1000 +
    circuit2.socaNumber * 10;

  return value1 - value2;
}

export function isBrumStyle(circuit) {
  // H11'11-1

  let type = circuit.substring(0, 1);

  // Check if circuit starts with H or D
  if (type === "H" || type === "D") {
    let typeAsNumber = type === "H" ? 0 : 1;
    // get dimmercity number
    let dc = parseInt(circuit.substring(1, 2));

    if (!Number.isNaN(dc)) {
      let pdu = parseInt(circuit.substring(2, 3));

      if (!Number.isNaN(pdu)) {
        if (circuit.substring(3, 4) === "'") {
          let lastPart = circuit.substring(4, circuit.length);

          // No - is the same as no circuit number
          if (lastPart.indexOf("-") === -1) {
            let socaNumber = parseInt(lastPart);
            return {
              dc,
              pdu,
              socaNumber,
              typeAsNumber,
            };
          } else {
            let splits = lastPart.split("-");
            if (splits.length === 2) {
              let socaNumber = parseInt(splits[0]);
              let circuitNumber = parseInt(splits[1]);

              return {
                dc,
                pdu,
                socaNumber,
                circuitNumber,
                typeAsNumber,
              };
            }
          }
        }
      }
    }
  }
  return null;
}

export function patchComparator(patch1, patch2) {
  let p1 = patchParser(patch1);
  let p2 = patchParser(patch2);

  if (p1 === null && p2 === null) {
    return 0;
  }

  if (p1 === null) {
    return -1;
  }
  if (p2 === null) {
    return 1;
  }

  let calc1 = p1.universe * 1000 + p1.address;
  let calc2 = p2.universe * 1000 + p2.address;

  return calc1 - calc2;
}

export function patchParser(patch) {
  let indexOfDotSeparator = patch.indexOf(".");
  let indexOfSlashSeparator = patch.indexOf("/");

  if (indexOfDotSeparator > -1) {
    let universe = parseInt(patch.substring(0, indexOfDotSeparator));
    let address = parseInt(
      patch.substring(indexOfDotSeparator + 1, patch.length)
    );

    if (Number.isNaN(universe) || Number.isNaN(address)) {
      return null;
    } else {
      return {
        universe,
        address,
      };
    }
  }

  if (indexOfSlashSeparator > -1) {
    let universe = parseInt(patch.substring(0, indexOfDotSeparator));
    let address = parseInt(
      patch.substring(indexOfDotSeparator + 1, patch.length)
    );

    if (Number.isNaN(universe) || Number.isNaN(address)) {
      return null;
    } else {
      return {
        universe,
        address,
      };
    }
  }
  return null;
}

export function dmxLineComparator(dmx1, dmx2) {
  let dmx1asArr = parseDmxLine(dmx1, "-");
  let dmx2asArr = parseDmxLine(dmx2, "-");

  if (dmx1asArr.length !== 2 && dmx2asArr.length !== 2) {
    return 0;
  }

  if (dmx1asArr.length !== 2) {
    return -1;
  }

  if (dmx2asArr.length !== 2) {
    return 1;
  }

  return (
    dmx1asArr[0] * 100 + dmx1asArr[1] - (dmx2asArr[0] * 100 + dmx2asArr[1])
  );
}

export function parseDmxLine(dmxLine, delimiter) {
  if (dmxLine.indexOf(delimiter) !== -1) {
    let parts = dmxLine.split(delimiter);
    return [parseInt(parts[0]), parseInt(parts[1])];
  }
  return [dmxLine];
}

export function stringNumberComparator(val1, val2) {
  
  let v1 = parseInt(val1);
  let v2 = parseInt(val2);

  if(Number.isNaN(v1) && Number.isNaN(v2)){
    return 0;
  }

  if(Number.isNaN(v1)){
    return -1;
  }

  if(Number.isNaN(v2)){
    return 1;
  }
  
  return v1 - v2;
}
