const sorter = (array) => {
    const newArr = [...array];
    newArr.sort(
        (a, b) => {
            console.log(a, b)
            // return a.age - b.age;
            return a.name > b.name ? 1 : a.name === b.name ? 0 : -1
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