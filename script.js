var bigassIDList = [2879, 2976, 2977, 2978, 2563, 2567, 2571, 2572, 2579, 2585, 2590, 2591, 2592, 2593, 3073, 3074, 3075, 3076, 3077, 3078, 3079, 3080, 3081, 3082, 3083, 2608, 3088, 3087, 2612, 2613, 3091, 3096, 2611, 3100, 3101, 3102, 3103, 3104, 3106, 2630, 2631, 3112, 3113, 3114, 2636, 3111, 3121, 3122, 2644, 2645, 3123, 2629, 2649, 2650, 2651, 3120, 2656, 2660, 2661, 2666, 2667, 3148, 3149, 3150, 3151, 3152, 3159, 3160, 3161, 3167, 3169, 2692, 2693, 2694, 2695, 2696, 2697, 2698, 2699, 2700, 2701, 2702, 3182, 2704, 3181, 2706, 2703, 3187, 2709, 3189, 3186, 3191, 2710, 3190, 3194, 3184, 3196, 3197, 2719, 3199, 2708, 2722, 3202, 3203, 2705, 3188, 2727, 2728, 2720, 2707, 2721, 3192, 3204, 2734, 2735, 3195, 2691, 3198, 3185, 2741, 2742, 2733, 2744, 2690, 3193, 2749, 2751, 2752, 2753, 2754, 2755, 2756, 2757, 2758, 2759, 2760, 2761, 2762, 2763, 2764, 2765, 2766, 2771, 2774, 1826, 2785, 2793, 2794, 2324, 2325, 2806, 2809, 2812, 2815, 2818, 2821, 2824, 2827, 2847, 2848, 2850, 2851, 2852, 2853, 2854, 2855, 2856, 2857, 2858, 2859, 2860, 2861, 2865, 2866, 2867];

var fade = true;

$(document).ready(function()
{
	// set up initial menu
	var menu = $("#menu-list");
	menu.append('<li>Weapons<ul class="menu-item hidden" id="weapons"></ul></li>');
	menu.append('<li>Abilities<ul class="menu-item hidden" id="abilities"></ul></li>');
	menu.append('<li>Armors<ul class="menu-item hidden" id="armor""></ul></li>');
	menu.append('<li>Other<ul class="menu-item hidden" id="other"></ul></li>');
	menu.append('<li id="unfound">Unfound Items</li>');
	menu.append('<li id="found">Found Items</li>');
	/*
	menu.append('<li id="save">Save List...</li>');
	menu.append('<li id="load">Load List...</li>');
	*/

	addItemsToList(weaponsList, menu.find("#weapons"));
	addItemsToList(abilitiesList, menu.find("#abilities"));
	addItemsToList(armorsList, menu.find("#armor"));
	addItemsToList(othersList, menu.find("#other"));

	// render all unfound items
	renderUnfoundItems();

	$("#unfound").click(function()
	{
		fade = true;
		renderUnfoundItems();
	});
	$("#found").click(function()
	{
		fade = true;
		renderFoundItems();
	});

	$("#save").click(function()
	{
	});

	$("#load").click(function()
	{
	});

	// display hand when hovering over save/load
	$("#save, #load, #unfound").hover(function()
	{
		$(this).css('cursor', 'pointer');
	},
	function()
	{
		$(this).css('cursor', 'default');
	});

	// hovering over menu title displays menu
	$("#menu-list > li").hover(function()
	{
		var menu = $(this).find(".menu-item");
		menu.fadeIn(100);
	},
	function()
	{
		var menu = $(this).find(".menu-item");
		menu.fadeOut(100);
	});

	// highlight menu item when hovering over and change cursor
	$(".menu-item li").hover(function()
	{
		$(this).addClass("highlight");
		$(this).css('cursor', 'pointer');
	},
	function()
	{
		$(this).removeClass("highlight");
		$(this).css('cursor', 'default');
	});

	$(".menu-item li").click(function()
	{
		var itemMainType = $(this).parent().attr("id");
		var itemSubType = $(this).html();

		fade = false;

		if (itemMainType == "weapons")
		{
			renderList(weaponsList[itemSubType]);
		}
		else if (itemMainType == "abilities")
		{
			renderList(abilitiesList[itemSubType]);
		}
		else if (itemMainType == "armor")
		{
			renderList(armorsList[itemSubType]);
		}
		else if (itemMainType == "other")
		{
			renderList(othersList[itemSubType]);
		}
	});
});

function addItemsToList(items, list)
{
	for (name in items)
	{
		list.append("<li>" + name + "</li>");
	}
}

function renderList(list)
{
	// clear list
	$("#items-list").empty();

	for (var i = 0; i < list.length; i++)
	{
		renderItem(list[i]);
	}

	// bind jquery for toggling checked when clicking an item
	$(".found").click(function()
	{
		toggleCheckBox($(this))
	});
}

function renderItem(id)
{
	var name = items[id][0];
	var x = items[id][3];
	var y = items[id][4];
	var stored = $.jStorage.get(id.toString(), -1) != -1;
	var found = false;

	// check the local storage and see if the item is found
	if (!stored)
	{
		$.jStorage.set(id.toString(), false);
	}
	else
	{
		found = $.jStorage.get(id.toString());
	}

	// add the item to the list
	$("#items-list").append('<li><div class="item" id="' + id + '"><p>' + name + 
			'</p><span class="item-img" style="background-position: -' + x +
			'px -' + y + 'px;"></span><button class="found"><p class="found-text">' +
			'Found</p><span class="found-box"></span></button></div></li>');

	// check the box if it's found
	if (found)
	{
		var last = $("#items-list li:last-child").children(".item");

		last.last().addClass("green");
		last.last().children(".found").children(".found-box").addClass("checked");
	}
}

function toggleCheckBox(box)
{
	var checkbox = box.find(".found-box");
	var isChecked = checkbox.hasClass("checked");
	var parentBox = checkbox.parent().parent();
	var id = parentBox.attr("id");

	if (isChecked)
	{
		checkbox.removeClass("checked");
		parentBox.removeClass("green");
		$.jStorage.set(id.toString(), false);

		// if we need to fade out since we're on a list, do it
		if (fade)
		{
			parentBox.fadeOut();
		}
	}
	else
	{
		checkbox.addClass("checked");
		parentBox.addClass("green");
		$.jStorage.set(id.toString(), true);

		// if we're on the unfound list, fade the item away when we find it
		if (fade)
		{
			parentBox.fadeOut();
		}
	
	}
}

function renderUnfoundItems()
{
	// clear list
	$("#items-list").empty();

	for (var i = 0; i < bigassIDList.length; i++)
	{
		var id = bigassIDList[i];
		var found = $.jStorage.get(id.toString());

		if (!found)
		{
			renderItem(id);
		}
	}

	// bind jquery for toggling checked when clicking an item
	$(".found").click(function()
	{
		toggleCheckBox($(this))
	});
}

function renderFoundItems()
{
	// clear list
	$("#items-list").empty();

	for (var i = 0; i < bigassIDList.length; i++)
	{
		var id = bigassIDList[i];
		var found = $.jStorage.get(id.toString());

		if (found)
		{
			renderItem(id);
		}
	}

	// bind jquery for toggling checked when clicking an item
	$(".found").click(function()
	{
		toggleCheckBox($(this))
	});
}
