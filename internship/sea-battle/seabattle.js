// don't forget !!! and ???

let game = function () {
  window.onload = function () {
    const logs = document.querySelector(".logs"); // поле логов
    const game = {
      started: false,
      mouseDown: false,
      auto: false,
      playerScore: 0,
      enemyScore: 0,
    };

    const qtShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    const players = ["player", "enemy"]; // игроки
    const ships = []; // корабли
    const enemies = []; // корабли противника
    const limits = new Set(); // ограничения (границы)
    const limitsEnemies = new Set(); // ограничения (границы) для кораблей вражеского флота

    const playerShots = new Set(); // выстрелы игрока
    const enemyShots = new Set(); // выстрелы вражеского флота

    const ship = new Set(); // временное хранилище для отрисовки корабля

    // начинаем рисовать корабль
    document.querySelector(".player").addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (e.which === 1) {
        if (game.started) {
          logs.textContent += "Нельзя рисовать корабли во время игры!\n";
          return;
        }

        game.mouseDown = true;

        let coords = getCoords(e);
        // если пересекаем корабль или границы
        if (limits.has(coords)) {
          logs.textContent +=
            "Нельзя рисовать новый корабль поверх старого или рядом с ним!\n";

          // !!! по идее если нас выкинуло сюда, то нет смысла отрабатывать логику mouseup ("заканчиваем рисовать корабль")

          game.mouseDown = false;
        }
      }
    });

    function getCoords(e) {
      let x = e.target.cellIndex;
      let y = e.target.closest("tr").innerText.replace(/\s/g, "");

      return `${x}:${y}`;
    }

    // рисуем корабль
    document.querySelector(".player").addEventListener("mousemove", (e) => {
      if (e.target.nodeName === "TD") {
        // рисуем только если зажата левая кнопка мыши
        if (game.mouseDown) {
          ship.add(`${getCoords(e)},false`); // Set не дублирует значения !
        }
      }
    });

    // заканчиваем рисовать корабль
    document.querySelector(".player").addEventListener("mouseup", (e) => {
      if (e.which === 1) {
        game.mouseDown = false;

        if (ship.size > 4) {
          logs.textContent += "Нельзя рисовать корабль более 4-х палуб!\n";
          ship.clear();
        } else {
          let count4 = 0;
          let count3 = 0;
          let count2 = 0;
          let count1 = 0;

          // проверяем кол-во отрисованных ранее кораблей
          for (let item of ships) {
            // 4
            if (item.length === 4 && ship.size === 4) {
              count4 = 1;
              logs.textContent += "Вы уже нарисовали 4-х палубный корабль!\n";
            }
            // 3
            if (item.length === 3 && ship.size === 3) {
              if (count3 < 2) {
                count3++;
              }
            }
            // 2
            if (item.length === 2 && ship.size === 2) {
              if (count2 < 3) {
                count2++;
              }
            }
            // 1
            if (item.length === 1 && ship.size === 1) {
              if (count1 < 4) {
                count1++;
              }
            }
          }

          if (count3 >= 2) {
            logs.textContent += "Вы уже нарисовали два 3-х палубных корабля!\n";
          }
          if (count2 >= 3) {
            logs.textContent += "Вы уже нарисовали три 2-х палубных корабля!\n";
          }
          if (count1 >= 4) {
            logs.textContent +=
              "Вы уже нарисовали четыре однопалубных корабля!\n";
          }

          // рисуем только если прошли все условия
          if (!count4 && count3 < 2 && count2 < 3 && count1 < 4) {
            let check = checkLimits(ship); // проверяем нет ли пересечений (true - есть пересечение, false - нет)
            if (!check) {
              addOuter(ship, limits); // добавляем ограничения
              ship.size ? ships.push(Array.from(ship)) : ""; // добавляем корабль
            } else {
              logs.textContent +=
                "Нельзя рисовать корабль поверх другого корабля или его границ!\n";
            }

            render(); // отрисовываем игровое поле
          }

          ship.clear();
        }
      }
    });

    // проверка на пересечение границ
    function checkLimits(set, who = 0) {
      let exists;
      for (let coords of set.values()) {
        if (who) {
          exists = limitsEnemies.has(coords.slice(0, coords.indexOf(",")));
        } else {
          exists = limits.has(coords.slice(0, coords.indexOf(",")));
        }

        if (exists) {
          return true;
        }
      }
      return false;
    }

    function getXY(coords) {
      let delimeter = coords.indexOf(":");
      let delimeterComma = coords.indexOf(",");

      let x = +coords.substring(0, delimeter);
      let y =
        delimeterComma !== -1
          ? +coords.slice(delimeter + 1, delimeterComma)
          : +coords.slice(delimeter + 1);
      let hit = coords.slice(delimeterComma + 1); // ??? как преобразовать

      return { x, y, hit };
    }

    // добавление границ
    function addOuter(ship, set) {
      for (let deck of ship.values()) {
        let { x, y } = getXY(deck);

        x === 0 || y === 0 ? "" : set.add(`${x}:${y}`);
        x - 1 === 0 || y === 0 ? "" : set.add(`${x - 1}:${y}`);
        x + 1 === 0 || x + 1 > 10 || y === 0 ? "" : set.add(`${x + 1}:${y}`);
        x === 0 || y - 1 === 0 ? "" : set.add(`${x}:${y - 1}`);
        x === 0 || y + 1 === 0 || y + 1 > 10 ? "" : set.add(`${x}:${y + 1}`);

        x - 1 === 0 || y - 1 === 0 ? "" : set.add(`${x - 1}:${y - 1}`);
        x + 1 === 0 || x + 1 > 10 || y - 1 === 0
          ? ""
          : set.add(`${x + 1}:${y - 1}`);
        x + 1 === 0 || x + 1 > 10 || y + 1 === 0 || y + 1 > 10
          ? ""
          : set.add(`${x + 1}:${y + 1}`);
        x - 1 === 0 || y + 1 === 0 || y + 1 > 10
          ? ""
          : set.add(`${x - 1}:${y + 1}`);
      }
    }

    // автоматическая отрисовка выстрелов вокруг потопленного корабля
    function addOuterShots(ship, shots) {
      for (let deck of ship) {
        let { x, y } = getXY(deck);

        x === 0 || y === 0 ? "" : shots.add(`${x}:${y}`);
        x - 1 === 0 || y === 0 ? "" : shots.add(`${x - 1}:${y}`);
        x + 1 === 0 || x + 1 > 10 || y === 0 ? "" : shots.add(`${x + 1}:${y}`);
        x === 0 || y - 1 === 0 ? "" : shots.add(`${x}:${y - 1}`);
        x === 0 || y + 1 === 0 || y + 1 > 10 ? "" : shots.add(`${x}:${y + 1}`);

        x - 1 === 0 || y - 1 === 0 ? "" : shots.add(`${x - 1}:${y - 1}`);
        x + 1 === 0 || x + 1 > 10 || y - 1 === 0
          ? ""
          : shots.add(`${x + 1}:${y - 1}`);
        x + 1 === 0 || x + 1 > 10 || y + 1 === 0 || y + 1 > 10
          ? ""
          : shots.add(`${x + 1}:${y + 1}`);
        x - 1 === 0 || y + 1 === 0 || y + 1 > 10
          ? ""
          : shots.add(`${x - 1}:${y + 1}`);
      }
    }

    // отрисовка игрового поля игрока
    function render() {
      // корабли
      ships.forEach((deck) => {
        deck.forEach((item) => {
          let { x, y, hit } = getXY(item);
          let cell = document.querySelector(
            `.player tr:nth-child(${y + 1}) td:nth-child(${x + 1})`
          );

          if (hit === "true") {
            cell.classList.add("ship", "wounded");
          } else {
            cell.classList.add("ship");
          }
        });
      });

      // промахи
      enemyShots.forEach((attempt) => {
        let { x, y } = getXY(attempt);
        let cell = document.querySelector(
          `.player tr:nth-child(${y + 1}) td:nth-child(${x + 1})`
        );

        if (!cell.classList.contains("wounded")) {
          cell.classList.add("miss");
        }
      });

      // ограничения
      limits.forEach((limit) => {
        let { x, y } = getXY(limit);
        let cell = document.querySelector(
          `.player tr:nth-child(${y + 1}) td:nth-child(${x + 1})`
        );

        try {
          if (!cell.classList.contains("ship")) {
            cell.classList.add("limit");
          }
        } catch (err) {
          console.log(err);
        }
      });
    }

    // отрисовка игрового поля компьютера
    function renderEnemy() {
      // корабли
      enemies.forEach((deck) => {
        deck.forEach((item) => {
          let { x, y, hit } = getXY(item);
          let cell = document.querySelector(
            `.enemy tr:nth-child(${y + 1}) td:nth-child(${x + 1})`
          );

          // ??? как преобразовать строку "true" в булевское true
          if (hit === "true") {
            cell.classList.add("ship", "hide", "wounded");
          } else {
            cell.classList.add("ship", "hide");
          }

          if (cell.classList.contains("wounded")) {
            cell.classList.remove("hide");
          }
        });
      });

      // промахи
      for (let shot of playerShots) {
        let { x, y } = getXY(shot);
        let cell = document.querySelector(
          `.enemy tr:nth-child(${y + 1}) td:nth-child(${x + 1})`
        );

        if (!cell.classList.contains("wounded")) {
          cell.classList.add("miss");
        }
      }

      // ограничения (границы)
      limitsEnemies.forEach((limit) => {
        let { x, y } = getXY(limit);
        let cell = document.querySelector(
          `.enemy tr:nth-child(${y + 1}) td:nth-child(${x + 1})`
        );

        try {
          if (!cell.classList.contains("ship")) {
            cell.classList.add("limit", "hide");
          }
        } catch (err) {
          console.log(err);
        }
      });
    }

    // start the Game!
    document.querySelector(".btn-start").addEventListener("click", (e) => {
      e.preventDefault(); // ???

      if (game.started) {
        logs.textContent += "Бой в самом разгаре!";
        return;
      }

      if (confirm("Готовы вступить в бой?")) {
        // перед началом игры проверяем есть ли нарисованные корабли
        if (!ships.length) {
          logs.textContent += "Сперва нарисуйте свои корабли!\n";
          return;
        } else if (ships.length !== 10) {
          logs.textContent += "Количество кораблей должно быть 10!\n";
          return;
        }

        // если свои корабли рисовали вручную, то необходимо автоматически отрисовать корабли противника
        if (!enemies.length) {
          //  отрисовываем корабли компьютера
          for (let i = 0; i < qtShips.length; i++) {
            setShipAuto(qtShips[i], 1);
          }
        }

        game.started = true;

        let firstMove = Math.round(Math.random());
        logs.textContent += `Первым стреляет ${players[firstMove]}!\n`;

        if (firstMove) {
          enemyShot();
        }
      }
    });

    // Выстрел компьютера
    function enemyShot() {
      let res;
      let { x, y } = setNewShot();

      //  идем по массиву кораблей -> "заходим" в каждый корабль и проверяем попали или нет
      for (let item of ships) {
        for (let deck of item) {
          // let { shipX, shipY } = getXY(deck); // ??? почему-то не срабатывает
          shipX = +deck.slice(0, deck.indexOf(":"));
          shipY = +deck.slice(deck.indexOf(":") + 1, deck.indexOf(","));
          res = x === shipX && y === shipY;
          // если попали
          if (res) {
            let idx = item.findIndex((el) => el === `${x}:${y},false`);
            item[idx] = `${x}:${y},true`;
            // смотрим потопили ли корабль и автоматически выставляем вокруг него выстрелы
            setShots(item, 1);
            break;
          }
        }

        if (res) {
          break;
        }
      }

      render();

      // если попали в корабль, то стреляем снова
      if (res) {
        enemyShot(); // стреляем до тех пор пока не промахнемся
      }
    }

    // Прицеливание компьютера - определение случайной точки координат
    function setNewShot() {
      let { x, y } = getRandomCoordinates();

      if (enemyShots.has(`${x}:${y}`)) {
        return setNewShot(); // компьютер стреляет еще раз если уже был такой выстрел
      } else {
        enemyShots.add(`${x}:${y}`);
      }

      return { x, y };
    }

    // Выстрел игрока
    document.querySelector(".enemy").addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.nodeName === "TD") {
        if (!game.started) {
          logs.textContent += "Начните игру! Нажмите кнопку 'Понеслась!'\n";
          return;
        }

        let res;
        const coords = getCoords(e);
        let x = +coords.slice(0, coords.indexOf(":"));
        let y = +coords.slice(coords.indexOf(":") + 1);

        let exists = playerShots.has(coords);
        if (exists) {
          logs.textContent +=
            "Э-э-э-э-э-э! ты уже стрелял сюда! попробуй еще!\n";
          return;
        }

        playerShots.add(coords);

        //  идем по массиву кораблей -> "заходим" в каждый корабль и проверяем попали или нет
        for (let item of enemies) {
          for (let deck of item) {
            shipX = +deck.slice(0, deck.indexOf(":"));
            shipY = +deck.slice(deck.indexOf(":") + 1, deck.indexOf(","));
            res = x === shipX && y === shipY;
            // если попали
            if (res) {
              let idx = item.findIndex((el) => el === `${x}:${y},false`);
              item[idx] = `${x}:${y},true`;
              // смотрим потопили ли корабль и автоматически выставляем вокруг него выстрелы
              setShots(item);
              break;
            }
          }

          if (res) {
            break;
          }
        }

        renderEnemy();

        // если попали по кораблю то стреляем дальше !
        if (res) {
          return;
        }

        enemyShot();
      }
    });

    //
    function setShots(ship, who = 0) {
      let decks = 0; // сколько осталось неподбитых палуб

      for (let deck of ship) {
        deck.includes("false") ? decks++ : "";
      }

      // если неподбитых палуб не осталось, значит корабль потоплен
      if (!decks) {
        who
          ? addOuterShots(ship, enemyShots)
          : addOuterShots(ship, playerShots);
        who ? game.enemyScore++ : game.playerScore++;
        logs.textContent += `Потоплен ${ship.length}-палубный корабль!\n`;
      }

      if (game.enemyScore === 10 || game.playerScore === 10) {
        document.querySelector(".popup").classList.add("popup--show");
        if (game.enemyScore === 10) {
          document.querySelector(".popup__image").src = "lose.gif";
          document.querySelector(".popup__text").innerText = "Лузер!";
          logs.textContent += `Искусственный интеллект оказался сильнее!\n`;
          return;
        }
        logs.textContent += `Победа за нами!!!\n`;
      }
    }

    // -- AUTO ---------------------------------------------------------------------
    // Нажали кнопку "Авто"
    document.querySelector(".btn-auto").addEventListener("click", (e) => {
      e.preventDefault();

      if (game.started) {
        logs.textContent += "Игра уже началась!\n";
        return;
      }

      if (game.auto) {
        logs.textContent +=
          "Вы уже расставили корабли автоматически! Зачем делать это еще раз?\n";
        return;
      }

      if (ships.length) {
        logs.textContent +=
          "Наверное, Вы уже начали рисовать корабли вручную. Продолжайте в том же духе!\n";
        return;
      }

      // отрисовываем корабли игрока
      for (let i = 0; i < qtShips.length; i++) {
        setShipAuto(qtShips[i]);
      }

      //  отрисовываем корабли компьютера
      for (let i = 0; i < qtShips.length; i++) {
        setShipAuto(qtShips[i], 1);
      }

      game.auto = true;
    });

    // автоматическая отрисовка корабля
    function setShipAuto(qtDecks, who = 0) {
      const drawShip = new Set();
      let direction = Math.round(Math.random()); // направление (0-горизонтально, 1-вертикально)
      let boundary =
        qtDecks === 4 ? 8 : qtDecks === 3 ? 9 : qtDecks === 2 ? 10 : 0;

      while (true) {
        let { x, y } = getRandomCoordinates(); // получили первую точку

        if (qtDecks === 1) {
          drawShip.add(`${x}:${y},false`);
          break;
        }

        if (x >= boundary) {
          !direction ? (direction = 1) : "";

          if (direction) {
            if (y >= boundary) {
              continue;
            } else {
              for (let i = y; i < y + qtDecks; i++) {
                drawShip.add(`${x}:${i},false`);
              }
              break;
            }
          }
        } else {
          if (!direction) {
            for (let i = x; i < x + qtDecks; i++) {
              drawShip.add(`${i}:${y},false`);
            }
            break;
          }
          if (direction) {
            if (y >= boundary) {
            } else {
              for (let i = y; i < y + qtDecks; i++) {
                drawShip.add(`${x}:${i},false`);
              }
              break;
            }
          }
        }
      }

      let check;
      who
        ? (check = checkLimits(drawShip, 1))
        : (check = checkLimits(drawShip)); // проверяем нет ли пересечений (true - есть пересечение, false - нет)
      if (!check) {
        if (who) {
          addOuter(drawShip, limitsEnemies); // добавляем ограничения
          enemies.push(Array.from(drawShip)); // добавляем корабль
        } else {
          addOuter(drawShip, limits); // добавляем ограничения
          ships.push(Array.from(drawShip)); // добавляем корабль
        }
      } else {
        who ? setShipAuto(qtDecks, 1) : setShipAuto(qtDecks);
      }

      who ? renderEnemy() : render(); // отрисовываем игровое поле
    }

    // получение случайных координат
    function getRandomCoordinates() {
      let x = Math.round(Math.random() * 10) || 1;
      let y = Math.round(Math.random() * 10) || 1;

      return { x, y };
    }
  };
};

game();
