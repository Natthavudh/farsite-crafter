import resources from "./resources.json" assert { type: "json" };
import components from "./components.json" assert { type: "json" };
import components_req from "./components-req.json" assert { type: "json" };
import refinery from "./refinery.json" assert { type: "json" };
import mining from "./mining.json" assert { type: "json" };

const input = document.getElementById("authorization");
let authorization = "";

const topText3 = document.getElementById("topText3");

async function getSeller(id) {
  const options = {
    method: "POST",
    headers: {
      authority: "farsite.online",
      accept: "application/json, text/plain, */*",
      "accept-language": "en,vi;q=0.9,th;q=0.8",
      authorization: "Bearer " + authorization,
      "content-type": "application/json;charset=UTF-8",
      origin: "https://play.farsite.online",
      referer: "https://play.farsite.online/",
      "sec-ch-ua":
        '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
      "x-request-id": "e42fcb54-29bc-4caa-af90-44580f3da241",
    },
    body: `{"filter":{"price":{"min":0,"max":0},"quantity":{"min":0,"max":0}},"orderBy":"price","orderDirection":"asc","originalId":${id},"page":1}`,
  };

  const resp = await fetch(
    "https://farsite.online/api/1.0/market/resources",
    options
  );
  const respData = await resp.json();
  const history = respData.data;
  return history;
}
let underValue = 200000;
let sellerOrders = [];
async function sellerValue() {
  let resApi = await getSeller(0);
  for (let i = 0; i < resources.length; i++) {
    let obj = {};
    let id = resources[i].id;

    if (resApi) {
      //console.log(resApi[0]);
      resApi = await getSeller(id);
      if (resApi.length !== 0) {
        let totalValue = 0;
        let quantity = 0;
        for (let j = 0; j < resApi.length; j++) {
          //console.log(resApi[j].price * resApi[j].quantity);
          if (totalValue < underValue) {
            totalValue += resApi[j].price * resApi[j].quantity;
            quantity += resApi[j].quantity;
          }
        }
        obj["id"] = resApi[0].originalId;
        obj["price"] = (totalValue / quantity).toFixed(0);
        obj["quantity"] = quantity;
        sellerOrders.push(obj);
        //console.log(totalValue, quantity);
      } else {
        obj.id = resources[i].id;
        obj.price = 0;
        obj.quantity = 0;
        sellerOrders.push(obj);
      }
      topText3.innerHTML =
        "Loading Seller Orders... " +
        (((i + 1) / resources.length) * 100).toFixed(0) +
        "%";
    } else {
      obj.id = resources[i].id;
      obj.price = 0;
      obj.quantity = 0;
      sellerOrders.push(obj);
    }
  }
}
async function getPrice(id) {
  const options = {
    method: "POST",
    headers: {
      authority: "farsite.online",
      accept: "application/json, text/plain, */*",
      "accept-language": "en,vi;q=0.9,th;q=0.8",
      authorization: "Bearer " + authorization,
      "content-type": "application/json;charset=UTF-8",
      origin: "https://play.farsite.online",
      referer: "https://play.farsite.online/",
      "sec-ch-ua":
        '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
      "x-request-id": "267b8257-94f5-4577-9aff-732c18ed9492",
    },
    body: `{"filter":{"price":{"min":0,"max":0},"quantity":{"min":0,"max":0}},"orderBy":"listed","orderDirection":"desc","originalId":${id},"page":1}`,
  };

  const resp = await fetch(
    "https://farsite.online/api/1.0/market/orders/resources",
    options
  );
  const respData = await resp.json();
  const history = respData.data;
  return history;
}

async function getComponentPrice(id) {
  const options = {
    method: "POST",
    headers: {
      authority: "farsite.online",
      accept: "application/json, text/plain, */*",
      "accept-language": "en,vi;q=0.9,th;q=0.8",
      authorization: "Bearer " + authorization,
      "content-type": "application/json;charset=UTF-8",
      origin: "https://play.farsite.online",
      referer: "https://play.farsite.online/",
      "sec-ch-ua":
        '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
      "x-request-id": "267b8257-94f5-4577-9aff-732c18ed9492",
    },
    body: `{"filter":{"price":{"min":0,"max":0},"quantity":{"min":0,"max":0}},"orderBy":"listed","orderDirection":"desc","originalId":${id},"page":1}`,
  };

  const resp = await fetch(
    "https://farsite.online/api/1.0/market/orders/components",
    options
  );
  const respData = await resp.json();
  const history = respData.data;
  return history;
}

const topText = document.getElementById("topText");
const topText2 = document.getElementById("topText2");
let priceApi = [];

async function newPrice() {
  let resApi = await getPrice(0);
  for (let i = 0; i < resources.length; i++) {
    let obj = {};
    let id = resources[i].id;

    if (resApi) {
      //console.log(resApi[0]);
      resApi = await getPrice(id);
      if (resApi.length !== 0) {
        obj["id"] = resApi[0].originalId;
        obj["price"] = resApi[0].price;
        obj["quantity"] = resApi[0].quantity;
        priceApi.push(obj);
      } else {
        obj.id = resources[i].id;
        obj.price = 0;
        obj.quantity = 0;
        priceApi.push(obj);
      }
      topText.innerHTML =
        "Loading Resources Price... " +
        (((i + 1) / resources.length) * 100).toFixed(0) +
        "%";
    } else {
      obj.id = resources[i].id;
      obj.price = 0;
      obj.quantity = 0;
      priceApi.push(obj);
    }
  }
}
//await newPrice();

let priceApi2 = [];
async function newPrice2() {
  let resApi = await getComponentPrice(0);
  for (let i = 0; i < components.length; i++) {
    let obj = {};
    let id = components[i].id;
    if (resApi) {
      resApi = await getComponentPrice(id);
      if (resApi.length !== 0) {
        obj["id"] = components[i].id;
        obj["price"] = resApi[0].price;
        obj["quantity"] = resApi[0].quantity;
        priceApi2.push(obj);
      } else {
        obj.id = components[i].id;
        obj.price = 0;
        obj.quantity = 0;
        priceApi2.push(obj);
      }
      topText2.innerHTML =
        "Loading Components Price... " +
        (((i + 1) / components.length) * 100).toFixed(0) +
        "%";
    } else {
      obj.id = components[i].id;
      obj.price = 0;
      obj.quantity = 0;
      priceApi2.push(obj);
    }
  }
}
await newPrice();
await newPrice2();
await sellerValue();
console.log(sellerOrders);
//console.log(priceApi);
//console.log(priceApi2);
//console.log(priceApi2[0]);
//console.log(priceApi2.find((x) => x.id === 387).price);

const miningTable = document.getElementById("mining_table");
async function addMining() {
  miningTable.innerHTML = "";
  const th = miningTable.insertRow(0);
  const cell1 = th.insertCell(0);
  const cell2 = th.insertCell(1);
  const cell3 = th.insertCell(2);
  const cell4 = th.insertCell(3);
  const cell5 = th.insertCell(4);
  const cell6 = th.insertCell(5);
  const cell7 = th.insertCell(6);
  const cell8 = th.insertCell(7);
  const cell9 = th.insertCell(8);
  const cell10 = th.insertCell(9);
  const cell11 = th.insertCell(10);

  cell1.outerHTML = "<th>Resources</th>";
  cell2.outerHTML = "<th>Name</th>";
  cell3.outerHTML = "<th>Id</th>";
  cell4.outerHTML = "<th>Group</th>";
  cell5.outerHTML = "<th>Type</th>";
  cell6.outerHTML = "<th>Quantity</th>";
  cell7.outerHTML = "<th>Price</th>";
  cell8.outerHTML = "<th>Fees</th>";
  cell9.outerHTML = "<th>Duration/Minutes</th>";
  cell10.outerHTML = "<th>Extraction</th>";
  cell11.outerHTML = "<th>Profit/Hour</th>";

  for (let i = 0; i < 31; i++) {
    const idKey = Number(Object.keys(mining[0])[i]);

    const idNumber = resources.find(({ id }) => id === idKey);
    const res = idNumber;
    const credits = mining[0][idKey].Requirements.Credits;
    const duration = mining[0][idKey].Duration / 60;
    const extraction = mining[0][idKey].Extraction;
    const price = priceApi.find(({ id }) => id === idKey);
    //console.log(price)
    const quantity = priceApi.find(({ id }) => id === idKey);

    const row = miningTable.insertRow(i + 1);
    const cols1 = row.insertCell(0);
    const cols2 = row.insertCell(1);
    const cols3 = row.insertCell(2);
    const cols4 = row.insertCell(3);
    const cols5 = row.insertCell(4);
    const cols6 = row.insertCell(5);
    const cols7 = row.insertCell(6);
    const cols8 = row.insertCell(7);
    const cols9 = row.insertCell(8);
    const cols10 = row.insertCell(9);
    const cols11 = row.insertCell(10);

    cols1.innerHTML = `
      <p style="color:white">${res.code}</p>
      `;
    cols1.style.backgroundColor = res.color;
    cols2.innerHTML = res.name;
    cols3.innerHTML = res.id;
    cols4.innerHTML = res.group;
    cols5.innerHTML = res.type;
    cols6.innerHTML = quantity.quantity;
    cols7.innerHTML = price.price;
    cols8.innerHTML = credits;
    cols9.innerHTML = duration;
    cols10.innerHTML = extraction;
    cols11.innerHTML = (
      ((price.price * extraction - credits) / duration) *
      60
    ).toFixed(2);
  }
  sortTable("mining_table", 10);
}
addMining();
const refineryTable = document.getElementById("refinery_table");
async function addRefinery() {
  refineryTable.innerHTML = "";
  const th = refineryTable.insertRow(0);
  const cell1 = th.insertCell(0);
  const cell2 = th.insertCell(1);
  const cell3 = th.insertCell(2);
  const cell4 = th.insertCell(3);
  const cell5 = th.insertCell(4);
  const cell6 = th.insertCell(5);
  const cell7 = th.insertCell(6);
  const cell8 = th.insertCell(7);
  const cell9 = th.insertCell(8);
  const cell10 = th.insertCell(9);
  const cell11 = th.insertCell(10);
  const cell12 = th.insertCell(11);
  const cell13 = th.insertCell(12);
  const cell14 = th.insertCell(13);
  const cell15 = th.insertCell(14);
  const cell16 = th.insertCell(15);
  const cell17 = th.insertCell(16);
  const cell18 = th.insertCell(17);

  cell1.outerHTML = "<th>Code</th>";
  cell2.outerHTML = "<th>Price*10</th>";
  cell3.outerHTML = "<th>Fees</th>";
  cell4.outerHTML = "<th>Dur/Min</th>";
  cell5.outerHTML = "<th>Output 1</th>";
  cell6.outerHTML = "<th>Qty</th>";
  cell7.outerHTML = "<th>Price*1</th>";
  cell8.outerHTML = "<th>Output 2</th>";
  cell9.outerHTML = "<th>Qty</th>";
  cell10.outerHTML = "<th>Price*1</th>";
  cell11.outerHTML = "<th>Output 3</th>";
  cell12.outerHTML = "<th>Qty</th>";
  cell13.outerHTML = "<th>Price*1</th>";
  cell14.outerHTML = "<th>Output 4</th>";
  cell15.outerHTML = "<th>Qty</th>";
  cell16.outerHTML = "<th>Price*1</th>";
  cell17.outerHTML = "<th>Cost</th>";
  cell18.outerHTML = "<th>Profits/Hour</th>";

  for (let i = 0; i < 18; i++) {
    const idKey = Number(Object.keys(refinery[0])[i]);
    const idResKey1 = Number(Object.keys(refinery[0][idKey].Receipt)[0]);
    const idResKey2 = Number(Object.keys(refinery[0][idKey].Receipt)[1]);
    const idResKey3 = Number(Object.keys(refinery[0][idKey].Receipt)[2]);
    const idResKey4 = Number(Object.keys(refinery[0][idKey].Receipt)[3]);

    const idNumber = resources.find(({ id }) => id === idKey);
    const res = idNumber;
    let min1 = Object.values(refinery[0][idKey].Receipt)[0].min * 1.2;
    if (min1 == 0) {
      min1 = 0.5;
    }
    //const max1 = Object.values(refinery[0][idKey].Receipt)[0].max;
    let min2 = Object.values(refinery[0][idKey].Receipt)[1].min * 1.2;
    if (min2 == 0) {
      min2 = 0.5;
    }
    //const max2 = Object.values(refinery[0][idKey].Receipt)[1].max;
    let min3 = Object.values(refinery[0][idKey].Receipt)[2].min * 1.2;
    if (min3 == 0) {
      min3 = 0.5;
    }
    //const max3 = Object.values(refinery[0][idKey].Receipt)[2].max;
    const credits = refinery[0][idKey].Requirements.Credits;
    const duration = refinery[0][idKey].Duration / 60;
    const findId1 = resources.find(({ id }) => id === idResKey1);
    const output1 = findId1.code;
    const findId2 = resources.find(({ id }) => id === idResKey2);
    const output2 = findId2.code;
    const findId3 = resources.find(({ id }) => id === idResKey3);
    const output3 = findId3.code;
    let output4 = "-";
    let outputPrice4 = 0;
    let min4 = 0;
    //let max4 = 0;
    const findId4 = resources.find(({ id }) => id === idResKey4);
    if (typeof findId4 !== "undefined") {
      min4 = Object.values(refinery[0][idKey].Receipt)[3].min * 1.2;
      //max4 = Object.values(refinery[0][idKey].Receipt)[3].max;
      outputPrice4 = priceApi.find(({ id }) => id === idResKey4).price;
      output4 = findId4.code;
    }
    const price = sellerOrders.find(({ id }) => id === idKey);
    const outputPrice1 = priceApi.find(({ id }) => id === idResKey1).price;
    const outputPrice2 = priceApi.find(({ id }) => id === idResKey2).price;
    const outputPrice3 = priceApi.find(({ id }) => id === idResKey3).price;

    const row = refineryTable.insertRow(i + 1);
    const cols1 = row.insertCell(0);
    const cols2 = row.insertCell(1);
    const cols3 = row.insertCell(2);
    const cols4 = row.insertCell(3);
    const cols5 = row.insertCell(4);
    const cols6 = row.insertCell(5);
    const cols7 = row.insertCell(6);
    const cols8 = row.insertCell(7);
    const cols9 = row.insertCell(8);
    const cols10 = row.insertCell(9);
    const cols11 = row.insertCell(10);
    const cols12 = row.insertCell(11);
    const cols13 = row.insertCell(12);
    const cols14 = row.insertCell(13);
    const cols15 = row.insertCell(14);
    const cols16 = row.insertCell(15);
    const cols17 = row.insertCell(16);
    const cols18 = row.insertCell(17);

    cols1.innerHTML = `<p style="color:white">${res.code}</p>`;
    cols1.style.backgroundColor = res.color;
    cols2.innerHTML = price.price * 10;
    cols3.innerHTML = credits;
    cols4.innerHTML = duration;
    cols5.innerHTML = `<p style="color:white">${output1}</p>`;
    cols5.style.backgroundColor = findId1.color;
    cols6.innerHTML = min1;
    cols7.innerHTML = outputPrice1;
    cols8.innerHTML = `<p style="color:white">${output2}</p>`;
    cols8.style.backgroundColor = findId2.color;
    cols9.innerHTML = min2;
    cols10.innerHTML = outputPrice2;
    cols11.innerHTML = `<p style="color:white">${output3}</p>`;
    cols11.style.backgroundColor = findId3.color;
    cols12.innerHTML = min3.toFixed(1);
    cols13.innerHTML = outputPrice3;
    cols14.innerHTML = `<p style="color:white">${output4}</p>`;
    if (findId4) {
      cols14.style.backgroundColor = findId4.color;
      cols15.innerHTML = min4;
      cols16.innerHTML = outputPrice4;
    }
    cols17.innerHTML = price.price * 10 + credits;
    cols18.innerHTML = (
      ((min1 * outputPrice1 +
        min2 * outputPrice2 +
        min3 * outputPrice3 +
        min4 * outputPrice4 -
        price.price * 10 -
        credits) /
        duration) *
      60
    ).toFixed(2);
  }
  sortTable("refinery_table", 17);
}
addRefinery();

const componentsTable = document.getElementById("components_table");
function addComponents() {
  componentsTable.innerHTML = "";
  const th = componentsTable.insertRow(0);
  const cell1 = th.insertCell(0);
  const cell2 = th.insertCell(1);
  const cell3 = th.insertCell(2);
  const cell4 = th.insertCell(3);
  const cell5 = th.insertCell(4);
  const cell6 = th.insertCell(5);
  const cell7 = th.insertCell(6);
  const cell8 = th.insertCell(7);
  const cell9 = th.insertCell(8);
  const cell10 = th.insertCell(9);
  const cell11 = th.insertCell(10);
  const cell12 = th.insertCell(11);
  const cell13 = th.insertCell(12);
  const cell14 = th.insertCell(13);
  const cell15 = th.insertCell(14);

  cell1.outerHTML = "<th>Name</th>";
  cell2.outerHTML = "<th>Price</th>";
  cell3.outerHTML = "<th>Fees</th>";
  cell4.outerHTML = "<th>Dur/Min</th>";
  cell5.outerHTML = "<th>Input 1&2</th>";
  cell6.outerHTML = "<th>Qty</th>";
  cell7.outerHTML = "<th>Price*Qty</th>";
  cell8.outerHTML = "<th>Input 3&4</th>";
  cell9.outerHTML = "<th>Qty</th>";
  cell10.outerHTML = "<th>Price*Qty</th>";
  cell11.outerHTML = "<th>Input 5&6</th>";
  cell12.outerHTML = "<th>Qty</th>";
  cell13.outerHTML = "<th>Price*Qty</th>";
  cell14.outerHTML = "<th>Cost</th>";
  cell15.outerHTML = "<th>Profits/Hour</th>";

  for (let i = 0; i < components.length; i++) {
    const idKey = components[i].id;
    let idResKey1 = 0;
    let idResKey2 = 0;
    let idResKey3 = 0;
    let idResKey4 = 0;
    let idResKey5 = 0;
    let idResKey6 = 0;
    if (typeof components_req[0][idKey] !== "undefined") {
      idResKey1 = Number(
        Object.keys(components_req[0][idKey].Requirements.Resources)[0]
      );

      idResKey2 = Number(
        Object.keys(components_req[0][idKey].Requirements.Resources)[1]
      );
      idResKey3 = Number(
        Object.keys(components_req[0][idKey].Requirements.Resources)[2]
      );
      idResKey4 = Number(
        Object.keys(components_req[0][idKey].Requirements.Resources)[3]
      );
      idResKey5 = Number(
        Object.keys(components_req[0][idKey].Requirements.Resources)[4]
      );
      idResKey6 = Number(
        Object.keys(components_req[0][idKey].Requirements.Resources)[5]
      );
    }
    //console.log(idKey)
    const idNumber = components.find(({ id }) => id === idKey);

    const name = idNumber.name;
    const size = idNumber.size;
    let qty1 = 0;
    let qty2 = 0;
    let qty3 = 0;
    let qty4 = 0;
    if (typeof components_req[0][idKey] !== "undefined") {
      qty1 = Object.values(components_req[0][idKey].Requirements.Resources)[0];
      qty2 = Object.values(components_req[0][idKey].Requirements.Resources)[1];
      qty3 = Object.values(components_req[0][idKey].Requirements.Resources)[2];
      qty4 = Object.values(components_req[0][idKey].Requirements.Resources)[3];
    }
    let qty5 = 0;
    let qty6 = 0;
    let findId1 = 0;
    let findId2 = 0;
    let findId3 = 0;
    let findId4 = 0;
    let findId5 = 0;
    let input1 = 0;
    let input2 = 0;
    let input3 = 0;
    let input4 = 0;
    let duration = 0;
    let fees = 1;
    if (typeof resources.find(({ id }) => id === idResKey1) !== "undefined") {
      findId1 = resources.find(({ id }) => id === idResKey1);
      input1 = findId1.code;
      findId2 = resources.find(({ id }) => id === idResKey2);
      input2 = findId2.code;
      findId3 = resources.find(({ id }) => id === idResKey3);
      input3 = findId3.code;
      findId4 = resources.find(({ id }) => id === idResKey4);
      input4 = findId4.code;
      findId5 = resources.find(({ id }) => id === idResKey5);

      duration = components_req[0][idKey].Duration / 60;
      fees = components_req[0][idKey].Requirements.Credits;
    }
    let input5 = "-";
    if (
      typeof findId5 !== "undefined" &&
      typeof components_req[0][idKey] !== "undefined"
    ) {
      input5 = findId5.code;
      qty5 = Object.values(components_req[0][idKey].Requirements.Resources)[4];
    }
    const findId6 = resources.find(({ id }) => id === idResKey6);
    let input6 = "-";
    if (typeof findId6 !== "undefined") {
      input6 = findId6.code;
      qty6 = Object.values(components_req[0][idKey].Requirements.Resources)[5];
    }
    const price = priceApi2.find(({ id }) => id === idKey).price;
    let inputPrice5 = 0;
    if (findId5) {
      inputPrice5 = sellerOrders.find(({ id }) => id === idResKey5).price;
    }
    let inputPrice6 = 0;
    if (findId6) {
      inputPrice6 = sellerOrders.find(({ id }) => id === idResKey6).price;
    }
    let inputPrice1 = 0;
    if (findId1) {
      inputPrice1 = sellerOrders.find(({ id }) => id === idResKey1).price;
    }
    let inputPrice2 = 0;
    if (findId2) {
      inputPrice2 = sellerOrders.find(({ id }) => id === idResKey2).price;
    }
    let inputPrice3 = 0;
    if (findId3) {
      inputPrice3 = sellerOrders.find(({ id }) => id === idResKey3).price;
    }
    let inputPrice4 = 0;
    if (findId4) {
      inputPrice4 = sellerOrders.find(({ id }) => id === idResKey4).price;
    }
    const row = componentsTable.insertRow(i + 1);
    row.style.height = "50px";
    row.style.border = "1px solid";
    row.style.margin = "10px";
    const cols1 = row.insertCell(0);
    const cols2 = row.insertCell(1);
    const cols3 = row.insertCell(2);
    const cols4 = row.insertCell(3);
    const cols5 = row.insertCell(4);
    const cols6 = row.insertCell(5);
    const cols7 = row.insertCell(6);
    const cols8 = row.insertCell(7);
    const cols9 = row.insertCell(8);
    const cols10 = row.insertCell(9);
    const cols11 = row.insertCell(10);
    const cols12 = row.insertCell(11);
    const cols13 = row.insertCell(12);
    const cols14 = row.insertCell(13);
    const cols15 = row.insertCell(14);

    cols1.innerHTML = `<p style align="left">${name} ${size}</p>`;
    cols2.innerHTML = price;
    cols3.innerHTML = fees;
    cols4.innerHTML = duration;
    cols5.innerHTML = `
    <p style="color:white" align="center"><p style="background-color:${findId1.color}">${input1}</p><p style="background-color:${findId2.color}">${input2}</p></p>
    `;
    //cols5.style.backgroundColor = findId1.color;
    cols6.innerHTML = `${qty1}<br>${qty2}`;
    cols7.innerHTML = `${inputPrice1 * qty1}<br>${inputPrice2 * qty2}`;
    //cols7.style.backgroundColor = findId2.color;
    cols8.innerHTML = `
    <p style="color:white" align="center"><p style="background-color:${findId3.color}">${input3}</p><p style="background-color:${findId4.color}">${input4}</p></p>
    `;
    cols9.innerHTML = `${qty3}<br>${qty4}`;
    //cols9.style.backgroundColor = findId3.color;
    cols10.innerHTML = `${inputPrice3 * qty3}<br>${inputPrice4 * qty4}`;
    if (findId5) {
      cols11.innerHTML = `
    <p style="color:white" align="center"><p style="background-color:${findId5.color}">${input5}</p>`;
    }
    if (findId6) {
      cols11.innerHTML = `
    <p style="color:white" align="center"><p style="background-color:${findId5.color}">${input5}</p><p style="background-color:${findId6.color}">${input6}</p></p>
    `;
    }
    //cols11.style.backgroundColor = findId4.color;
    cols12.innerHTML = `${qty5}<br>${qty6}`;
    cols13.innerHTML = `${inputPrice5 * qty5}<br>${inputPrice6 * qty6}`;
    //cols13.style.backgroundColor = findId5.color;

    cols14.innerHTML =
      fees +
      qty1 * inputPrice1 +
      qty2 * inputPrice2 +
      qty3 * inputPrice3 +
      qty4 * inputPrice4 +
      qty5 * inputPrice5 +
      qty6 * inputPrice6;

    cols15.innerHTML = (
      ((price -
        (qty1 * inputPrice1 +
          qty2 * inputPrice2 +
          qty3 * inputPrice3 +
          qty4 * inputPrice4 +
          qty5 * inputPrice5 +
          qty6 * inputPrice6 +
          fees)) /
        duration) *
      60
    ).toFixed(2);
  }
  sortTable("components_table", 14);
}
addComponents();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputT = input.value;

  if (inputT) {
    authorization = inputT;
    input.value = "";
    priceApi = [];
    priceApi2 = [];
    sellerOrders = [];

    (async () => {
      await newPrice();
      await newPrice2();
      await sellerValue();
      console.log(sellerOrders);
      addMining();
      addRefinery();
      addComponents();
    })();
  }
});

function sortTable(id, column) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById(id);
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      y = rows[i].getElementsByTagName("TD")[column];
      x = rows[i + 1].getElementsByTagName("TD")[column];
      //check if the two rows should switch place:
      if (Number(x.innerHTML) > Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
