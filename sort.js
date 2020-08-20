const sorter = (array) => {
    const newArr = [...array];
    newArr.sort(
        (a, b) => {
            console.log(a, b)
            // return a.age - b.age;
            return a.age > b.age ? 1 : a.age === b.age ? 0 : -1
        }
    )
    return newArr;
}

// export default sorter;

const data = [
    { name: "cca", age: 11 },
    { name: "aaa", age: 14 },
    { name: "aba", age: 13 },
]

console.log(sorter(data));