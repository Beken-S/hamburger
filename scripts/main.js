"use strict";

/**
 * Создает ингридиент блюда.
 */
class Ingredient {
  quantity = 1;
  constructor(
    type = "Nameless",
    name = "Nameless",
    basePrice = 0,
    baseCalories = 0
  ) {
    this.type = type;
    this.name = name;
    this.basePrice = basePrice;
    this.baseCalories = baseCalories;
  }

  /**
   * Добавляет порцию ингридиента.
   */
  add() {
    this.quantity++;
  }

  /**
   * Убирает порцию ингридиента.
   */
  reduce() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /**
   * Вычисляет общую стоимость ингридиента.
   * @returns общая стоимость.
   */
  calcTotalPrice() {
    return this.basePrice * this.quantity;
  }

  /**
   * Вычисляет общую калорийность ингридиента.
   * @returns общая калорийность.
   */
  calcTotalCalories() {
    return this.baseCalories * this.quantity;
  }

  /**
   * Возвращает HTML разметку ингридиента в виде строки.
   * @returns HTML разметка.
   */
  getMarkup() {
    return `
      <div class="ingredient">
        <div class="ingredient-name">${this.name}</div>
        <div class="ingredient-data">${this.quantity} шт.</div>
        <div class="ingredient-data">${this.calcTotalPrice()} руб.</div>
        <div class="ingredient-data">${this.calcTotalCalories()} кал</div>
      </div>
    `;
  }
}

/**
 * Создает блюдо.
 */
class Dish {
  ingredients = [];
  price = 0;
  calories = 0;
  constructor(name = "Nameless", ...ingredients) {
    this.name = name;
    ingredients.forEach((ingredient) => this.addIngredient(ingredient));
  }

  /**
   * Добавляет ингридиент к блюду.
   * @param {Ingredient} ingredient объект ингридиента.
   */
  addIngredient(ingredient) {
    const position = this.ingredients.findIndex(
      (el) => el.name === ingredient.name
    );
    if (position < 0) {
      this.ingredients.push(ingredient);
      this.calcPrice();
      this.calcCalories();
    } else {
      this.ingredients[position].add();
      this.calcPrice();
      this.calcCalories();
    }
  }

  /**
   * Удаляет ингридиент из блюда.
   * @param {Ingredient} ingredient объект ингридиента.
   */
  removeIngredient(ingredient) {
    const position = this.ingredients.findIndex((el) => el.name === ingredient);
    if (position >= 0) {
      this.ingredients.splice(position, 1);
      this.calcPrice();
      this.calcCalories();
    }
  }

  /**
   * Уменьшает порцию ингридиента в блюде.
   * @param {Ingredient} ingredient объект ингридиента.
   */
  reduceIngredient(ingredient) {
    const position = this.ingredients.findIndex((el) => el.name === ingredient);
    if (position >= 0) {
      this.ingredients[position].reduce();
      this.calcPrice();
      this.calcCalories();
    }
  }

  /**
   * Вычисляет стоимость блюда.
   */
  calcPrice() {
    this.price = this.ingredients.reduce((totalPrice, ingredient) => {
      return totalPrice + ingredient.calcTotalPrice();
    }, 0);
  }

  /**
   * Вычисляет общую калорийность.
   */
  calcCalories() {
    this.calories = this.ingredients.reduce((totalCalories, ingredient) => {
      return totalCalories + ingredient.calcTotalCalories();
    }, 0);
  }

  /**
   * Возвращает HTML разметку блюда в виде строки.
   * @param  {...any} types типы и порядок ингридиентов.
   * @returns HTML разметка.
   */
  getMarkup(...types) {
    if (types.length === 0) {
      this.sort();
      types = this.ingredients.reduce((typesArr, ingredient, i) => {
        typesArr[i - 1] !== ingredient.type && typesArr.push(ingredient.type);
        return typesArr;
      }, []);
    }
    const ingredientsList = types.map((type) => {
      const filter = this.ingredients.filter(
        (ingredient) => ingredient.type === type
      );

      return filter.reduce((markup, ingredient, i) => {
        if (i === 0) {
          markup += `<div class=type>${ingredient.type}:</div>`;
        }
        return markup + `${ingredient.getMarkup()}`;
      }, "");
    });
    return `
      <div class="dish">
        <div class="main-info">
          <div class="dish-name">${this.name}</div>
          <div class="dish-data">${this.price} руб.</div>
          <div class="dish-data">${this.calories} кал</div>
        </div>
        <div class="details">
          ${ingredientsList.join(" ")}
        </div>

      </div>
    `;
  }

  /**
   * Сортирует массив ингридиентов по типам ингридиентов.
   */
  sort() {
    this.ingredients.sort((a, b) => {
      if (a.type < b.type) {
        return -1;
      }
      if (a.type > b.type) {
        return 1;
      }
      return 0;
    });
  }
}

/**
 * Создает гамбургер.
 */
class Hamburger extends Dish {
  constructor(name, stuffing = "сыр") {
    super(name);
    this.addStuffing(stuffing);
  }

  /**
   * Добавляет начинку в гамбургер.
   * @param {string} stuffing одна из трех начинок (сыр - значение
   * по умолчанию, салат, картофель).
   */
  addStuffing(stuffing = "сыр") {
    switch (stuffing) {
      case "сыр":
        this.addIngredient(new Ingredient("Начинка", "сыр", 10, 20));
        break;
      case "салат":
        this.addIngredient(new Ingredient("Начинка", "салат", 20, 5));
        break;
      case "картофель":
        this.addIngredient(new Ingredient("Начинка", "картофель", 15, 10));
        break;
      default:
        this.addIngredient(new Ingredient("Начинка", "сыр", 10, 20));
        break;
    }
  }

  /**
   * Изменяет начинку гамбургера.
   * @param {string} stuffing одна из трех начинок (сыр - значение
   * по умолчанию, салат, картофель).
   */
  changeStuffing(stuffing = "сыр") {
    const position = this.ingredients.findIndex((el) => el.type === "Начинка");
    if (position >= 0) {
      this.removeIngredient(this.ingredients[position].name);
      this.addStuffing(stuffing);
    }
  }

  /**
   * Добавляет добавку к гамбургеру.
   * @param {string} additives одна из двух добавок (приправа - значение
   * по умолчанию, майонез).
   */
  addAdditives(additives = "приправа") {
    switch (additives) {
      case "приправа":
        this.addIngredient(new Ingredient("Добавка", "приправа", 15, 0));
        break;
      case "майонез":
        this.addIngredient(new Ingredient("Добавка", "майонез", 20, 5));
        break;
      default:
        this.addIngredient(new Ingredient("Добавка", "приправа", 15, 0));
        break;
    }
  }

  /**
   * Убирает добавку к гамбургеру.
   * @param {string} additives одна из двух добавок (приправа - значение
   * по умолчанию, майонез).
   */
  removeAdditives(additives) {
    const position = this.ingredients.findIndex((el) => {
      return el.name === additives && el.type === "Добавка";
    });
    if (position >= 0) {
      this.removeIngredient(additives);
    }
  }

  /**
   * Уменьшает порцию добавки в гамбургере.
   * @param {string} additives одна из двух добавок (приправа - значение
   * по умолчанию, майонез).
   */
  reduceAdditives(additives) {
    const position = this.ingredients.findIndex((el) => {
      return el.name === additives && el.type === "Добавка";
    });
    if (position >= 0) {
      this.reduceIngredient(additives);
    }
  }

  /**
   * Возвращает количество порций добавки в гамбургере.
   * @param {string} additives одна из двух добавок (приправа - значение
   * по умолчанию, майонез).
   */
  getAdditivesQuantity(additive) {
    const position = this.ingredients.findIndex((el) => {
      return el.name === additive && el.type === "Добавка";
    });
    if (position >= 0) {
      return this.ingredients[position].quantity;
    }
    return 0;
  }
}

/**
 * Создает Большой гамбургер.
 */
class BigHamburger extends Hamburger {
  constructor(stuffing = "сыр") {
    super("Большой гамбургер", stuffing);
    this.addIngredient(
      new Ingredient("Основа", "большая булка и котлета", 100, 40)
    );
  }
}

/**
 * Создает Маленький гамбургер.
 */
class SmallHamburger extends Hamburger {
  constructor(stuffing = "сыр") {
    super("Маленький гамбургер", stuffing);
    this.addIngredient(
      new Ingredient("Основа", "маленькая булка и котлета", 50, 20)
    );
  }
}

onload = () => {
  let hamburger = null;
  const result = document.querySelector(".result");
  const radioBasis = document.querySelectorAll("input[name='basis']");
  const radioStuffings = document.querySelectorAll("input[name='stuffing']");
  const numberAdditives = document.querySelectorAll("input[name='additive']");

  /**
   * Инициализация страницы.
   */
  function init() {
    const basisEl = document.querySelector("input[name='basis']:checked");
    const stuffingEl = document.querySelector("input[name='stuffing']:checked");
    // const additivesEl =
    switch (basisEl.id) {
      case "big":
        hamburger = new BigHamburger(stuffingEl.value);
        getAdditives();
        render();
        break;
      case "small":
        hamburger = new SmallHamburger(stuffingEl.value);
        getAdditives();
        render();
        break;
    }
  }

  /**
   * Отрисовывает гамбургер на странице.
   */
  function render() {
    result.innerHTML = "";
    result.insertAdjacentHTML(
      "afterbegin",
      hamburger.getMarkup("Основа", "Начинка", "Добавка")
    );
  }

  /**
   * Добавляет добавки к гамбургеру.
   */
  function getAdditives() {
    numberAdditives.forEach((el) => {
      const additive = el.id === "seasoning" ? "приправа" : "майонез";
      const number = +el.value - hamburger.getAdditivesQuantity(additive);
      if (+el.value === 0) {
        hamburger.removeAdditives(additive);
      } else if (number > 0) {
        for (let i = 0; i < number; i++) {
          hamburger.addAdditives(additive);
        }
      } else if (number < 0) {
        for (let i = number; i < 0; i++) {
          hamburger.reduceAdditives(additive);
        }
      }
    });
  }

  radioBasis.forEach((radio) => {
    radio.addEventListener("change", (el) => {
      const stuffingEl = document.querySelector(
        "input[name='stuffing']:checked"
      );
      switch (el.target.id) {
        case "big":
          hamburger = new BigHamburger(stuffingEl.value);
          getAdditives();
          break;
        case "small":
          hamburger = new SmallHamburger(stuffingEl.value);
          getAdditives();
          break;
      }
      render();
    });
  });

  radioStuffings.forEach((radio) => {
    radio.addEventListener("change", (el) => {
      switch (el.target.id) {
        case "cheese":
          hamburger.changeStuffing(el.target.value);
          getAdditives();
          break;
        case "salad":
          hamburger.changeStuffing(el.target.value);
          getAdditives();
          break;
        case "potato":
          hamburger.changeStuffing(el.target.value);
          getAdditives();
          break;
      }
      render();
    });
  });

  numberAdditives.forEach((number) => {
    number.addEventListener("change", (el) => {
      getAdditives();
      render();
    });
  });

  init();
};
