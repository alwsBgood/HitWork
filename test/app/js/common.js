var href = document.location.href;
var result_number = href.split('man_health_number=')[1];

$('#result').html(Number(result_number).toFixed(0));