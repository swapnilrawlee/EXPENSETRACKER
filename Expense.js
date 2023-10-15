//// cacl control/////
var calCntrl = (function () {
  //created object for key value required
  var valObjtCnstInc = function (description, value, id) {
    this.description = description;
    this.value = value;
    this.id = id;
  };
  var valObjtCnstExp = function (description, value, id) {
    this.description = description;
    this.value = value;
    this.id = id;
  };

  // calculation of inc and exp

  var calcBudget = function (type) {
    var sum = 0;
    vals.allinput[type].forEach(function (cur) {
      sum = sum + cur.value;
    });
    vals.totalall[type] = sum;
  };

  //created object for variables
  var vals = {
    allinput: {
      inc: [],
      exp: [],
    },
    totalall: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percent: -1,
  };

  return {
    getinput: function (description, value, type) {
      var newItem, id;

      if (vals.allinput[type].length > 0) {
        id = vals.allinput[type][vals.allinput[type].length - 1].id + 1;
      } else if (vals.allinput[type].length == 0) {
        id = 0;
      }

      //value divided where to go
      if (type == "inc") {
        newItem = new valObjtCnstInc(description, value, id);
      } else if (type == "exp") {
        newItem = new valObjtCnstExp(description, value, id);
      }

      //value inserted
      vals.allinput[type].push(newItem);

      return newItem;
    },

    // calculate budget starts fro here
    calBud: function (type) {
      calcBudget(type);
      vals.budget = vals.totalall.inc - vals.totalall.exp;
      vals.percent = Math.round((vals.totalall.exp / vals.totalall.inc) * 100);
    },
    retBud: function () {
      return {
        budget: vals.budget,
        totalinc: vals.totalall.inc,
        totalexp: vals.totalall.exp,
        percent: vals.percent,
      };
    },
    //delete function starts from here
    deleteItem: function (type, id) {
      var ids, index;
      ids = vals.allinput[type].map(function (cur) {
        return cur.id;
      });

      index = ids.indexOf(id);

      if (index != -1) {
        vals.allinput[type].splice(index, 1);
      }
    },
  };
})();

//// ui control ////
var UiCntrl = (function () {
  // used for not making mistakes in name and change everything -- long process --
  var classlist = {
    type: ".add-type",
    description: ".add-description",
    value: ".add-value",
    btn: ".add-btn",
    bud: ".budget-value",
    incvalue: ".budget-income-value",
    expvalue: ".budget-expense-value",
    percent: ".budget-expenses-percentage",
    mainbox: ".main-box",
    date: ".budget-title-month",
  };

  //taking values from user
  return {
    //public area
    getinput: function () {
      return {
        description: document.querySelector(classlist.description).value,
        value: parseInt(document.querySelector(classlist.value).value),
        type: document.querySelector(classlist.type).value,
      };
    },
    addItem: function (newEle, type) {
      var html;
      if (type == "inc") {
        html =
          '<div class="income-add" id="inc-_id_"><div id="idContainer"><div class="item-description">__description</div><div class="itemvalue">__value</div><button class="item__delete--btn"><i class="fa-solid fa-delete-left"></i></button></div></div>';
      } else if (type == "exp") {
        html =
          '<div class="expense-add " id="exp-_id_"><div id="idContainer1"><div class="item-description">__description</div><div class="itemvalue">__value</div><button class="item__delete--btn"><i class="fa-solid fa-delete-left"></i></button></div></div>';
      }
      newHTML = html.replace("_id_", newEle.id);
      newHTML = newHTML.replace("__description", newEle.description);
      newHTML = newHTML.replace("__value", newEle.value);
      if (type == "inc") {
        document
          .querySelector(".income-add")
          .insertAdjacentHTML("beforeend", newHTML);
      } else {
        document
          .querySelector(".expense-add")
          .insertAdjacentHTML("beforeend", newHTML);
      }
    },

    clearItem: function () {
      var field, fieldArray;
      field = document.querySelectorAll(
        classlist.description + "," + classlist.value
      );
      fieldArray = Array.prototype.slice.call(field);
      fieldArray.forEach(function (cur, index, array) {
        cur.value = "";
      });
      fieldArray[0].focus();
    },
    displayBud: function (budval) {
      budval.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(classlist.bud).textContent = UiCntrl.formattext(
        budval.budget,
        type
      );
      document.querySelector(classlist.incvalue).textContent =
        UiCntrl.formattext(budval.totalinc, type);
      document.querySelector(classlist.expvalue).textContent =
        UiCntrl.formattext(budval.totalexp, type);
      document.querySelector(classlist.percent).textContent = budval.percent;

      if (budval.percent > 0) {
        document.querySelector(classlist.percent).textContent =
          "+" + budval.percent + "%";
      } else {
        document.querySelector(classlist.percent).textContent = "--%";
      }
    },
    formattext: function (num, type) {
      var sign;
      num = Math.abs(num);
      num = num.toFixed(2);
      var numsplit = num.split(".");
      var int = numsplit[0];
      var dec = numsplit[1];
      if (num.length > 4) {
        int =
          int.substr(0, int.length - 3) +
          "," +
          int.substr(int.length - 3, int.length);
      }

      sign = type === "exp" ? "-" : "+";
      return sign + "" + int + "." + dec;
    },
    deleteElement: function (element) {
      var el = document.getElementById(element);
      el.parentNode.removeChild(el);
    },
    displayDate: function () {
      var monnth;
      var d = new Date();
      monnth = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      var month = d.getMonth();
      var year = d.getFullYear();
      document.querySelector(classlist.date).textContent =
        monnth[month] + "," + year;
    },
    passclasslist: function () {
      return classlist;
    },
  };
})();

//// main control ////
var mainCntrl = (function () {
  //variables
  var classlistMain = UiCntrl.passclasslist();

  var deleteEle = function (event) {
    var Item, splitItem, type, Id;
    Item = event.target.parentNode.parentNode.parentNode.id;
    splitItem = Item.split("-");
    type = splitItem[0];
    Id = parseInt(splitItem[1]);
    calCntrl.deleteItem(type, Id);
    UiCntrl.deleteElement(Item);
    updBudget(type);
  };

  var updBudget = function (type) {
    calCntrl.calBud(type);
    var budget = calCntrl.retBud();
    UiCntrl.displayBud(budget);
  };

  var addBtn = document.querySelector(classlistMain.btn);
  //main function
  var initMain = function () {
    var input = UiCntrl.getinput();
    var sendinput = calCntrl.getinput(
      input.description,
      input.value,
      input.type
    );

    UiCntrl.addItem(sendinput, input.type);
    UiCntrl.clearItem();
    updBudget(input.type);
  };

  var start = function () {
    addBtn.addEventListener("click", initMain);
    addBtn.addEventListener("keypress", function (event) {
      if (event.keyCode == 13 || event.which == 13) {
        initMain();
      }
    });

    document
      .querySelector(classlistMain.mainbox)
      .addEventListener("click", deleteEle);
  };

  //public area
  return {
    init: function () {
      console.log("started ");
      start();
      UiCntrl.displayBud({
        budget: 0,
        totalinc: 0,
        totalexp: 0,
        percent: 0,
      });
      UiCntrl.displayDate();
    },
  };
})(calCntrl, UiCntrl);
mainCntrl.init();
