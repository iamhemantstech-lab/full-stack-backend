const promiseOne = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("async task is complete");
    resolve();
  }, 1000);
});

promiseOne.then((data) => {
  console.log("promise consumed");
});

new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("async task 2");
    resolve();
  }, 1000);
}).then(() => {
  console.log("promise 2 consumed");
});

const promiseThree = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({ name: "John", city: "Kerala" });
  }, 1000);
});

promiseThree.then((user) => {
  console.log(user);
});

// -----------------------------------------------  Use full syntax in backend  -----------------------------------
const promiseFour = new Promise((resolve, reject) => {
  setTimeout(() => {
    let error = true;
    if (!error) {
      resolve({ name: "Paul", city: "Guhana" });
    } else {
      reject("Error: Something went wrong");
    }
  }, 1000);
});

promiseFour
  .then((data) => {
    return data.name;
  })
  .then((name) => {
    console.log(name);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log("Finally state executed");
  });

const promiseFive = new Promise((resolve, reject) => {
  setTimeout(() => {
    let error = false;
    if (!error) {
      resolve({ name: "react", city: "mumbai" });
    } else {
      reject("Error: react went wrong");
    }
  }, 1000);
});

const consumedPromiseFive = async () => {
  try {
    const response = await promiseFive;
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

consumedPromiseFive();
