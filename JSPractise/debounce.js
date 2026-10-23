let count = 0;
function OnSearch() {
  console.log("user typing... ", count++);
}

function debounc(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const searchDebounc = debounc(OnSearch, 300);
