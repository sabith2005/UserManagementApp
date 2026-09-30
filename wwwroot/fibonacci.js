document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("fibonacciForm");

    form.addEventListener(
        "submit",
        generateFibonacci
    );

});


function generateFibonacci(event) {

    event.preventDefault();

    const rows =
        parseInt(
            document.getElementById("rows").value
        );

    const columns =
        parseInt(
            document.getElementById("columns").value
        );

    const message =
        document.getElementById("message");

    const table =
        document.getElementById("fibonacciTable");

    // Clear previous results
    table.innerHTML = "";
    message.textContent = "";


    // Validate rows
    if (
        isNaN(rows) ||
        rows < 1 ||
        rows > 50
    ) {

        message.textContent =
            "Rows must be between 1 and 50.";

        return;
    }


    // Validate columns
    if (
        isNaN(columns) ||
        columns < 1 ||
        columns > 50
    ) {

        message.textContent =
            "Columns must be between 1 and 50.";

        return;
    }


    // Total number of Fibonacci values needed
    const totalNumbers =
        rows * columns;


    // Generate Fibonacci numbers
    const fibonacci =
        generateFibonacciNumbers(
            totalNumbers
        );


    // Create table
    let index = 0;


    for (let row = 0; row < rows; row++) {

        const tableRow =
            document.createElement("tr");


        for (
            let column = 0;
            column < columns;
            column++
        ) {

            const tableCell =
                document.createElement("td");


            tableCell.textContent =
                fibonacci[index];


            tableRow.appendChild(
                tableCell
            );


            index++;
        }


        table.appendChild(
            tableRow
        );
    }


    message.textContent =
        `Generated ${rows} × ${columns} Fibonacci table.`;
}


function generateFibonacciNumbers(count) {

    const numbers = [];


    if (count >= 1) {
        numbers.push(0);
    }


    if (count >= 2) {
        numbers.push(1);
    }


    for (
        let i = 2;
        i < count;
        i++
    ) {

        const nextNumber =
            numbers[i - 1] +
            numbers[i - 2];


        numbers.push(
            nextNumber
        );
    }


    return numbers;
}