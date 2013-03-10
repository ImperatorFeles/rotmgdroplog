$(document).ready(function()
{
	$(".found").click(function()
	{
		var checkbox = $(this).find(".found-box");
		var isChecked = checkbox.hasClass("checked");

		if (isChecked)
		{
			checkbox.removeClass("checked");
			checkbox.parent().parent().removeClass("green");
		}
		else
		{
			checkbox.addClass("checked");
			checkbox.parent().parent().addClass("green");
		}
	});
});

