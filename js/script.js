var bigassIDList = [];

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

	generateIDList();

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
	$("#save, #load, #unfound, #found").hover(function()
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

	// click search button
	$("#search > button").click(function()
	{
		renderSearchItem($(this).parent().find("input").val());
	});

	// hit enter on search box
	$("#search > input").keypress(function (e)
	{
		if (e.which == 13)
		{
			renderSearchItem($(this).val());
		}
	});
});

// adds a list of items to a menu listing
function addItemsToList(items, list)
{
	for (name in items)
	{
		list.append("<li>" + name + "</li>");
	}
}

// renders a list of ids in list
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

// renders an item with the id, id
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

// toggles the "found" check box
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

//renders all items flagged as unfound
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

// renders all items flagged as found
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

// renders a list of items based on the search string, item
function renderSearchItem(item)
{
	var list = [];
	var cleared = false;
	var found = false;

	for (var i = 0; i < bigassIDList.length; i++)
	{
		var id = bigassIDList[i];
		var name = items[id][0];

		if (name.toLowerCase().search(item.toLowerCase()) >= 0)
		{
			found = true;

			// clear list
			if (!cleared)
			{
				$("#items-list").empty();
				cleared = true;
			}

			renderItem(id);
		}
	}

	if (!found)
	{
		$("#items-list").empty();
		$("#items-list").append('<p class="red">Item not found</p>');
	}


	// bind jquery for toggling checked when clicking an item
	$(".found").click(function()
	{
		fade = false;
		toggleCheckBox($(this))
	});
}

// creates the id list from the menu listings
function generateIDList()
{
	for (var name in weaponsList)
	{
		bigassIDList = bigassIDList.concat(weaponsList[name]);
	}
	for (var name in abilitiesList)
	{
		bigassIDList = bigassIDList.concat(abilitiesList[name]);
	}
	for (var name in armorsList)
	{
		bigassIDList = bigassIDList.concat(armorsList[name]);
	}
	for (var name in othersList)
	{
		bigassIDList = bigassIDList.concat(othersList[name]);
	}
}
