// 最初の <img> タグを取得
var img = document.querySelector('img');

if (img) {
  // 100から500までのランダムな数値を生成
  var rrr = Math.floor(Math.random() * 150) + 100; // 100から500までの数値を生成
  // <img> タグの width 属性を設定
  if (Math.random()<.5) img.style.width = rrr + '%';
  else img.style.height = rrr + '%';
  // 0から100までのランダムな数値を生成して object-position に設定
  var randomPositionX = Math.floor(Math.random() * 101); // 0から100までの数値を生成
  var randomPositionY = Math.floor(Math.random() * 101); // 0から100までの数値を生成
  img.style.objectPosition = randomPositionX + '% ' + randomPositionY + '%';
}