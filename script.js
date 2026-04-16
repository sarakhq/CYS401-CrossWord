 const words = [
      {
        number: 1,
        answer: "VISHING",
        clue: "A voice-call-based phishing attack.",
        row: 0,
        col: 7,
        direction: "down"
      },
      {
        number: 2,
        answer: "PHISHING",
        clue: "A fraudulent attempt to steal information through fake messages or emails.",
        row: 1,
        col: 2,
        direction: "across"
      },
      {
        number: 2,
        answer: "POLICIES",
        clue: "Organizational rules and guidelines for security.",
        row: 1,
        col: 2,
        direction: "down"
      },
      {
        number: 3,
        answer: "FIREWALL",
        clue: "A network security barrier that filters incoming and outgoing traffic.",
        row: 3,
        col: 9,
        direction: "down"
      },
      {
        number: 4,
        answer: "DATA",
        clue: "Information that attackers often try to steal.",
        row: 3,
        col: 12,
        direction: "down"
      },
      {
        number: 5,
        answer: "ENCRYPTION",
        clue: "The process of converting readable information into secure coded form.",
        row: 5,
        col: 6,
        direction: "across"
      },
      {
        number: 6,
        answer: "BREACH",
        clue: "An incident where sensitive information is exposed or accessed without authorization.",
        row: 7,
        col: 0,
        direction: "across"
      },
      {
        number: 7,
        answer: "PASSWORD",
        clue: "A secret string used to authenticate a user.",
        row: 8,
        col: 8,
        direction: "across"
      }
    ];

    const rows = 11;
    const cols = 17;

    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

    for (const word of words) {
      for (let i = 0; i < word.answer.length; i++) {
        const r = word.direction === "across" ? word.row : word.row + i;
        const c = word.direction === "across" ? word.col + i : word.col;

        if (!grid[r][c]) {
          grid[r][c] = {
            answer: word.answer[i],
            number: null
          };
        } else if (grid[r][c].answer !== word.answer[i]) {
          throw new Error(`Invalid crossword layout at row ${r}, col ${c}`);
        }
      }
    }

    const numberingMap = {};
    for (const word of words) {
      const key = `${word.row},${word.col}`;
      if (!(key in numberingMap)) {
        numberingMap[key] = word.number;
      }
      grid[word.row][word.col].number = numberingMap[key];
    }

    const gridElement = document.getElementById("grid");
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 42px)`;
    gridElement.style.gridTemplateRows = `repeat(${rows}, 42px)`;

    const inputMap = {};

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellData = grid[r][c];
        const cell = document.createElement("div");

        if (!cellData) {
          cell.className = "cell blocked";
        } else {
          cell.className = "cell";

          if (cellData.number) {
            const number = document.createElement("div");
            number.className = "number";
            number.textContent = cellData.number;
            cell.appendChild(number);
          }

          const input = document.createElement("input");
          input.maxLength = 1;
          input.dataset.answer = cellData.answer;
          input.dataset.row = r;
          input.dataset.col = c;

          input.addEventListener("input", (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
          });

          cell.appendChild(input);
          inputMap[`${r},${c}`] = input;
        }

        gridElement.appendChild(cell);
      }
    }

    function checkAnswers() {
      let correct = 0;
      let total = 0;

      Object.values(inputMap).forEach(input => {
        total++;
        const expected = input.dataset.answer;
        const actual = (input.value || "").toUpperCase();

        input.classList.remove("correct", "wrong");

        if (actual === expected) {
          input.classList.add("correct");
          correct++;
        } else {
          input.classList.add("wrong");
        }
      });

      document.getElementById("result").textContent = `Score: ${correct} / ${total}`;
    }

    function showAnswers() {
      Object.values(inputMap).forEach(input => {
        input.value = input.dataset.answer;
        input.classList.remove("wrong");
        input.classList.add("correct");
      });
      document.getElementById("result").textContent = "Answers revealed.";
    }

    function resetPuzzle() {
      Object.values(inputMap).forEach(input => {
        input.value = "";
        input.classList.remove("correct", "wrong");
      });
      document.getElementById("result").textContent = "";
    }

    const acrossClues = words.filter(w => w.direction === "across");
    const downClues = words.filter(w => w.direction === "down");

    const acrossContainer = document.getElementById("across-clues");
    acrossClues.forEach(word => {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${word.number}.</strong> ${word.clue}`;
      acrossContainer.appendChild(p);
    });

    const downContainer = document.getElementById("down-clues");
    downClues.forEach(word => {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${word.number}.</strong> ${word.clue}`;
      downContainer.appendChild(p);
    });
 