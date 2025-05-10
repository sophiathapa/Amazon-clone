import { formatCurrency } from "../../scripts/utils/money.js";

console.log("Test suite : formatCurrency");
console.log("converts cents into dollars");
//Automated Test
//types of Test Cases
// 1) Basic test case

if (formatCurrency(2095) === "20.95") console.log("test passed");
else console.log("test failed");

//2) Edge cases
console.log("works with zero");
if (formatCurrency(0) === "0.00") console.log("test passed");
else console.log("test failed");

console.log("rounds upto nearest cent");
if (formatCurrency(2000.5) === "20.01") {
  console.log("test passed");
} else console.log("test failed");
