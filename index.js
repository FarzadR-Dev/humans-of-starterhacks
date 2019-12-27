let peopleData = [];

const initializeFaveBtnClickListeners = () => {
  const faveBtns = document.getElementsByClassName("fave-btn");
  Array.from(faveBtns).forEach(btn => {
    btn.addEventListener("click", () => {
      const recordId = btn.dataset.rid;
      toggleIsFavourite(recordId);
    });
  });
};

const replaceHTMLCardTemplate = () => {
  var source = document.getElementById("card-template").innerHTML;
  var template = Handlebars.compile(source);
  var context = { people: peopleData };
  var html = template(context);
  document.getElementById("target").innerHTML = html;

  initializeFaveBtnClickListeners();
};

const toggleIsFavourite = recordId => {
  console.log("is_favourite button clicked for: " + recordId);

  let person = peopleData.find(p => p.recordId === recordId);

  updatePersonInDatabase(recordId, { is_favourite: !person.is_favourite });
};

const getData = () => {
  const url =
    "https://api.airtable.com/v0/appbCjCrgXZtlpR5L/HumansOfStarterHacks";

  const key = "keykNUh12C5UP5SNh";
  const options = {
    headers: {
      Authorization: `Bearer ${key}`
    }
  };
  fetch(url, options)
    .then(result => result.json())
    .then(result => {
      peopleData = result.records.map(p => {
        return {
          recordId: p.id,
          ...p.fields
        };
      });
      replaceHTMLCardTemplate();
    });
};

getData();

const updatePersonInDatabase = (recordId, fields) => {
  const url = `https://api.airtable.com/v0/appbCjCrgXZtlpR5L/HumansOfStarterHacks/${recordId}`;

  const key = "keykNUh12C5UP5SNh";
  const body = { fields };

  const options = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  fetch(url, options)
    .then(result => result.json())
    .then(result => {
      peopleData = peopleData.map(p =>
        p.recordId === result.id ? { recordId: result.id, ...result.fields } : p
      );
      replaceHTMLCardTemplate();
    });
};
