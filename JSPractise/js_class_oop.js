function User(uname, city, visitcount) {
  this.uname = uname;
  this.city = city;
  this.visitcount = visitcount;
  return this;
}

const userOne = User("Pop", "Use", 5);

console.log(userOne);
