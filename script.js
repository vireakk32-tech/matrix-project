// ===============================
// MATRIX INVERSE CALCULATOR
// Gauss-Jordan Elimination
// ===============================

// Create matrix input fields
function createMatrix() {
    let n = parseInt(document.getElementById("size").value);

    let html = "<table class='matrixTable'>";

    for (let i = 0; i < n; i++) {
        html += "<tr>";
        for (let j = 0; j < n; j++) {
            html += `<td><input id="a${i}${j}" value="0" type="number"></td>`;
        }
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById("matrixContainer").innerHTML = html;
}

// Clear everything
function clearAll() {
    document.getElementById("matrixContainer").innerHTML = "";
    document.getElementById("originalMatrix").innerHTML = "";
    document.getElementById("steps").innerHTML = "Waiting for calculation...";
    document.getElementById("result").innerHTML = "No result";
}

// Convert matrix to HTML table
function matrixToTable(M) {
    let html = "<table class='resultTable'>";

    for (let i = 0; i < M.length; i++) {
        html += "<tr>";
        for (let j = 0; j < M[i].length; j++) {
            html += `<td>${M[i][j].toFixed(4)}</td>`;
        }
        html += "</tr>";
    }

    html += "</table>";
    return html;
}

// Main inverse function
function inverseMatrix() {
    let n = parseInt(document.getElementById("size").value);

    let A = [];
    let I = [];

    // Read matrix input
    for (let i = 0; i < n; i++) {
        A[i] = [];
        I[i] = [];

        for (let j = 0; j < n; j++) {
            let value = parseFloat(document.getElementById("a" + i + j).value);

            if (isNaN(value)) {
                value = 0;
            }

            A[i][j] = value;
            I[i][j] = i === j ? 1 : 0;
        }
    }

    let steps = "";

    steps += "Starting Gauss-Jordan Elimination...\n\n";

    // Show original matrix
    document.getElementById("originalMatrix").innerHTML = matrixToTable(A);

    // Gauss-Jordan elimination
    for (let i = 0; i < n; i++) {
        let pivot = A[i][i];

        // Pivot check
        if (pivot === 0) {
            let swapped = false;

            for (let k = i + 1; k < n; k++) {
                if (A[k][i] !== 0) {
                    [A[i], A[k]] = [A[k], A[i]];
                    [I[i], I[k]] = [I[k], I[i]];

                    steps += `Swapped Row ${i + 1} with Row ${k + 1}\n`;

                    pivot = A[i][i];
                    swapped = true;
                    break;
                }
            }

            if (!swapped) {
                document.getElementById("steps").innerText = steps;
                document.getElementById("result").innerHTML =
                    "<span class='error'>Matrix is not invertible</span>";
                return;
            }
        }

        // Normalize pivot row
        steps += `\nR${i + 1} = R${i + 1} / ${pivot}\n`;

        for (let j = 0; j < n; j++) {
            A[i][j] /= pivot;
            I[i][j] /= pivot;
        }

        // Eliminate other rows
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                let factor = A[k][i];

                steps += `R${k + 1} = R${k + 1} - (${factor}) * R${i + 1}\n`;

                for (let j = 0; j < n; j++) {
                    A[k][j] -= factor * A[i][j];
                    I[k][j] -= factor * I[i][j];
                }
            }
        }
    }

    // Output steps
    document.getElementById("steps").innerText = steps;

    // Display notation [A] → [A⁻¹]
    let notation = `
        <div class="notation">
            <div class="matrixBox">[A]</div>
            <div class="arrow">→</div>
            <div class="matrixBox">[A⁻¹]</div>
        </div>
    `;

    // Final result
    let resultHTML = notation + matrixToTable(I);

    document.getElementById("result").innerHTML = resultHTML;
}