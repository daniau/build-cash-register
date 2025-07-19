let price = 19.5;
let cid =
[["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]
let currencyUnits = [
  ["PENNY", 0.01],
  ["NICKEL", 0.05],
  ["DIME", 0.1],
  ["QUARTER", 0.25],
  ["ONE", 1],
  ["FIVE", 5],
  ["TEN", 10],
  ["TWENTY", 20],
  ["ONE HUNDRED", 100]

]
const cashEl = document.getElementById("cash");
const sale = document.getElementById("purchase-btn");
const changeEl = document.getElementById("change-due");
sale.addEventListener("click", () => {
  const cashValue = parseFloat(cashEl.value);
  let changeValue = cashValue - price
  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
   if (cashValue === price) {
    changeEl.innerHTML = `<p style="font-size:14px">No change due - customer paid with exact cash</p>`;
    return;
  }
  const changeResult=getChange(changeValue,cid)
  const formatChange=changeResult.change.filter((el)=>{if(el[1]!==0)return el})
  .map((el)=>`<p style="font-size:14px">${el[0]}: $${el[1]}</p>`).join("")
  changeEl.innerHTML=`Status: ${changeResult.status} ${formatChange}`

  cashEl.value=""



})
cashEl.addEventListener("keydown",(event)=>{
  if(event.key=="Enter"){
    sale.click();
  }
})
const getChange = function (changeValue, cid) {
  const totalCid = parseFloat((cid.reduce((sum, cid) => {
    return sum + cid[1]
  }, 0)).toFixed(2))
  if (totalCid < changeValue) {
    return { status: "INSUFFICIENT_FUNDS", change: [] }
  }

  let changeArray = [];
  let remaningChange = changeValue;
  for (let i = currencyUnits.length - 1; i >= 0; i--) {
    let unit = currencyUnits[i][0];
    let unitValue = currencyUnits[i][1];
    let unitAmount = cid[i][1];
    if (remaningChange >= unitValue && unitAmount > 0) {
      let amountOfUnit = 0
      while (remaningChange >= unitValue && unitAmount > 0) {
        amountOfUnit += unitValue;
        unitAmount = (unitAmount-unitValue).toFixed(2);
        remaningChange = (remaningChange - unitValue).toFixed(2)
      }
      if (amountOfUnit > 0) {
        changeArray.push([unit,parseFloat( amountOfUnit.toFixed(2))])
      }

    }
  }
  if(remaningChange!=0){
    return { status: "INSUFFICIENT_FUNDS", change: [] }

  }
  
  if (totalCid === changeValue) {
    return { status: "CLOSED", change: cid }

  }
  return { status: "OPEN", change: changeArray }
}

