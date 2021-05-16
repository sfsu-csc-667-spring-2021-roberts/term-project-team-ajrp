const cardList = document.getElementById("cardOwn");

function showCards(item, index) {
  cardList.innerHTML += "form(class=\"form-container\" action=\"/game/playCard\" method=\"POST\") label(for=\"c_"+index+"\")"+" "+item.name+" input(type=\"hidden\" name=\"hidden\" value=\""+item.id+"\") input(type=\"submit\" name=\"submit\" value=\"Play Card\")";
}
/*
fetch("/dashboard/cardsOwn")
  .then(results => {
    console.log(results);
	results.forEach(showCards);
});
*/