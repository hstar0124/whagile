// 카테고리 타입
export var Category;
(function (Category) {
  Category["Backlog"] = "백로그";
  Category["Before"] = "진행 전";
  Category["InProgress"] = "진행 중";
  Category["Done"] = "완료";
})(Category || (Category = {}));


// 긴급도 타입
export var Urgency;
(function (Urgency) {
  Urgency["LowGrade"] = "낮음";
  Urgency["NormalGrade"] = "보통";
  Urgency["HighGrade"] = "긴급";
})(Urgency || (Urgency = {}));

