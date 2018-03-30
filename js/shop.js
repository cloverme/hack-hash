/**
 Dialog info for game shops
 */

var SHOP_COUNT = 10;

var SHOP_WEAPON = 0;
var SHOP_ARMOR = 1;
var SHOP_SPELL = 2;
var SHOP_ROOM = 3;
var SHOP_MESSAGE = 4;

var shop = new Array();
for (var i=0; i<SHOP_COUNT; i++) {
  shop[i] = new Object();
  shop[i].item = new Array();
}

// Cedar Village Shops
shop[0].name = "ASIC Factory";
shop[0].item[0] = {type:SHOP_WEAPON, value:2};
shop[0].item[1] = {type:SHOP_WEAPON, value:3};
shop[0].background = 3;

shop[1].name = "Tethers Leathers";
shop[1].item[0] = {type:SHOP_ARMOR, value:2};
shop[1].item[1] = {type:SHOP_ARMOR, value:3};
shop[1].background = 3;

shop[2].name = "Hackers Den";
shop[2].item[0] = {type:SHOP_MESSAGE, msg1:"The book has", msg2:"all the secrets"};
shop[2].item[1] = {type:SHOP_MESSAGE, msg1:"Secret #2", msg2:"p16/5p/20w"};
shop[2].item[2] = {type:SHOP_ROOM, value:10};
shop[2].background = 3;

shop[3].name = "Crypto Mart";
shop[3].item[0] = {type:SHOP_MESSAGE, msg1:"Fire magic is effective", msg2:"against undead and bone."};
shop[3].item[1] = {type:SHOP_SPELL, value:2};
shop[3].background = 3;

shop[4].name = "Counterparty";
shop[4].item[0] = {type:SHOP_MESSAGE, msg1:"There is hidden crypto", msg2:"somewhere in the land."};
shop[4].item[1] = {type:SHOP_MESSAGE, msg1:"Secret #1", msg2:"B-2441M"};
shop[4].background = 3;

shop[5].name = "Untethered Lands";
shop[5].item[0] = {type:SHOP_MESSAGE, msg1:"There is a secret book", msg2:"of treasure"};
shop[5].item[1] = {type:SHOP_MESSAGE, msg1:"Secret #3", msg2:"p8-1p-3l-10l-p16-3l"};
shop[5].background = 3;

shop[6].name = "NSA Office";
shop[6].item[0] = {type:SHOP_MESSAGE, msg1:"Hack magic opens doors", msg2:"to loot and secrets"};
shop[6].item[1] = {type:SHOP_SPELL, value:3};
shop[6].background = 3;

shop[7].name = "Satoshi Hideout";
shop[7].item[0] = {type:SHOP_MESSAGE, msg1:"Secret #4", msg2:"p38/1p/15w"};
shop[7].item[1] = {type:SHOP_MESSAGE, msg1:"The treasure", msg2:"is not in this world"};
shop[7].background = 3;

shop[8].name = "Hack & Hash";
shop[8].item[0] = {type:SHOP_MESSAGE, msg1:"A bot has taken", msg2:"over these lands"};
shop[8].item[1] = {type:SHOP_MESSAGE, msg1:"and hid a crypto", msg2:"treasure, now lost..."};
shop[8].background = 2;

shop[9].name = "Age of Rust Relics";
shop[9].item[0] = {type:SHOP_MESSAGE, msg1:"Libraries are", msg2:"lost to time..."};
shop[9].item[1] = {type:SHOP_MESSAGE, msg1:"#7 ", msg2:"p31/4p/18w"};
shop[9].background = 3;

//---- Set choice options for shops --------


function shop_set(shop_id) {
  
  dialog.shop_id = shop_id;
  dialog.title = shop[shop_id].name;
  dialog.select_pos = BUTTON_POS_OPT2;
  dialog.items_for_sale = false;

  // most shops should use the exit button as the third option
  dialog.option[2].button = DIALOG_BUTTON_EXIT;
  dialog.option[2].msg1 = "Exit";
  dialog.option[2].msg2 = "";

  // shops can have two items for purchase
  for (var i=0; i<=1; i++) {
    if (shop[shop_id].item[i]) {
      if (shop[shop_id].item[i].type == SHOP_WEAPON) {
        shop_set_weapon(i, shop[shop_id].item[i].value);
      }
      else if (shop[shop_id].item[i].type == SHOP_ARMOR) {
        shop_set_armor(i, shop[shop_id].item[i].value);
      }
      else if (shop[shop_id].item[i].type == SHOP_SPELL) {
        shop_set_spell(i, shop[shop_id].item[i].value);
      }
      else if (shop[shop_id].item[i].type == SHOP_ROOM) {
        shop_set_room(i, shop[shop_id].item[i].value);
      }
      else if (shop[shop_id].item[i].type == SHOP_MESSAGE) {
        shop_set_message(i, shop[shop_id].item[i].msg1, shop[shop_id].item[i].msg2);
      }
    }
    else {
      shop_clear_slot(i);
    }
  }

}

function shop_set_weapon(slot, weapon_id) {
  var disable_reason = "";
  if (weapon_id == avatar.weapon) disable_reason = "(You own this)";
  else if (weapon_id < avatar.weapon) disable_reason = "(Yours is better)";

  shop_set_buy(slot, info.weapons[weapon_id].name, info.weapons[weapon_id].crypto, disable_reason);
}

function shop_set_armor(slot, armor_id) {
  var disable_reason = "";
  if (armor_id == avatar.armor) disable_reason = "(You own this)";
  else if (armor_id < avatar.armor) disable_reason = "(Yours is better)";

  shop_set_buy(slot, info.armors[armor_id].name, info.armors[armor_id].crypto, disable_reason);
}

function shop_set_spell(slot, spell_id) {
  var disable_reason = "";
  if (spell_id <= avatar.spellbook) disable_reason = "(You know this)";
  else if (spell_id > avatar.spellbook +1) disable_reason = "(Too advanced)";
  
  shop_set_buy(slot, "Spellbook: " + info.spells[spell_id].name, info.spells[spell_id].crypto, disable_reason); 
}

function shop_set_room(slot, room_cost) {
  var disable_reason = "";
  if (avatar.hp == avatar.max_hp && avatar.mp == avatar.max_mp) disable_reason = "(You are well rested)";
  shop_set_buy(slot, "Room for the night", room_cost, disable_reason);
}

function shop_set_message(slot, msg1, msg2) {
  dialog.option[slot].button = DIALOG_BUTTON_NONE;
  dialog.option[slot].msg1 = msg1;
  dialog.option[slot].msg2 = msg2;
}

function shop_set_buy(slot, name, cost, disable_reason) {

  dialog.option[slot].msg1 = "Buy " + name;

  // show the crypto cost or the reason you can't
  if (disable_reason != "") {
    dialog.option[slot].msg2 = disable_reason;
  }
  else {
    dialog.option[slot].msg2 = "for " + cost + " crypto";
  }

  // display the dialog button if the item can be purchased
  var can_buy = true;
  if (avatar.crypto < cost) can_buy = false;
  if (disable_reason != "") can_buy = false;

  if (can_buy) {
    dialog.option[slot].button = DIALOG_BUTTON_BUY;
  }
  else {
    dialog.option[slot].button = DIALOG_BUTTON_NONE;
  }
  
  // used to determine whether to display current crypto
  dialog.items_for_sale = true;
}

function shop_clear_slot(slot) {
  dialog.option[slot].msg1 = "";
  dialog.option[slot].msg2 = "";
  dialog.option[slot].button = DIALOG_BUTTON_NONE;
}

//---- Handle choices for shops --------

function shop_act(shop_id, slot_id) {

  if (slot_id == 2) {
    shop_exit(shop_id);
    return;
  }

  if (shop[shop_id].item[slot_id].type == SHOP_WEAPON) {
    shop_buy_weapon(shop[shop_id].item[slot_id].value);
    return;
  }

  if (shop[shop_id].item[slot_id].type == SHOP_ARMOR) {
    shop_buy_armor(shop[shop_id].item[slot_id].value);
    return;
  }

  if (shop[shop_id].item[slot_id].type == SHOP_SPELL) {
    shop_buy_spell(shop[shop_id].item[slot_id].value);
    return;
  }
  
  if (shop[shop_id].item[slot_id].type == SHOP_ROOM) {
    shop_buy_room(shop[shop_id].item[slot_id].value);
    return;
  }  
}

function shop_buy_weapon(weapon_id) {
  var cost = info.weapons[weapon_id].crypto;
  if (avatar.crypto < cost) return;

  avatar.crypto -= cost;
  sounds_play(SFX_COIN);
  avatar.weapon = weapon_id;
  dialog.message = "Bought " + info.weapons[weapon_id].name;
  shop_set(dialog.shop_id);
  redraw = true;

}

function shop_buy_armor(armor_id) {
  var cost = info.armors[armor_id].crypto;
  if (avatar.crypto < cost) return;

  avatar.crypto -= cost;
  sounds_play(SFX_COIN);
  avatar.armor = armor_id;
  dialog.message = "Bought " + info.armors[armor_id].name;
  shop_set(dialog.shop_id);
  redraw = true;
}

function shop_buy_spell(spell_id) {
  var cost = info.spells[spell_id].crypto;
  if (avatar.crypto < cost) return;
  
  avatar.crypto -= cost;
  sounds_play(SFX_COIN);
  avatar.spellbook = spell_id;
  dialog.message = "Learned " + info.spells[spell_id].name;
  shop_set(dialog.shop_id);
  redraw = true;
}

function shop_buy_room(cost) {
  if (avatar.crypto < cost) return;
  
  avatar.crypto -= cost;
  sounds_play(SFX_COIN);
  dialog.message = "You have rested";
  
  avatar_sleep();
  shop_set(dialog.shop_id);
  redraw = true;
}

function shop_exit(shop_id) {
  sounds_play(SFX_CLICK);
  gamestate = STATE_EXPLORE;
  redraw = true; 
}




