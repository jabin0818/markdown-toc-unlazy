'use strict';

/**
 * Module dependencies
 */

var diacritics = require('diacritics-map');
var li = require('list-item');
var mdlink = require('markdown-link');
var m = require('minimist');
var merge = require('mixin-deep');
var pick = require('object.pick');
var remarkable = require('remarkable');
var repeat = require('repeat-string');
var strip_color = require('strip-color');

/**
 * Get the "title" from a markdown link
 */

function getTitle(str) {
  if (/^\[[^\]]+\]\(/.test(str)) {
    var m = /^\[([^\]]+)\]/.exec(str);
    if (m) return m[1];
  }
  return str;
};

/**
 * Slugify the url part of a markdown link.
 *
 * @name  options.slugify
 * @param  {String} `str` The string to slugify
 * @param  {Object} `options` Pass a custom slugify function on `options.slugify`
 * @return {String}
 * @api public
 */

function slugify(str, options) {
  options = options || {};
  if (options.slugify === false) return str;
  if (typeof options.slugify === 'function') {
    return options.slugify(str, options);
  }

  str = getTitle(str);
  str = strip_color(str);
  str = str.toLowerCase();

  // `.split()` is often (but not always) faster than `.replace()`
  str = str.split(' ').join('-');
  str = str.split(/\t/).join('--');
  if (options.stripHeadingTags !== false) {
    str = str.split(/<\/?[^>]+>/).join('');
  }
  str = str.split(/[|$&`~=\\\/@+*!?({[\]})<>=.,;:'"^]/).join('');
  str = str.split(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/).join('');
  str = replaceDiacritics(str);
  if (options.num) {
    str += '-' + options.num;
  }
  return str;
};

function replaceDiacritics(str) {
  return str.replace(/[À-ž]/g, function(ch) {
    return diacritics[ch] || ch;
  });
}

/**
 * Expose `utils` modules
 */

const utils = {
  li: li,
  mdlink: mdlink,
  minimist: m,
  merge: merge,
  pick: pick,
  Remarkable: remarkable,
  repeat: repeat,
  strip_color: strip_color,
  slugify: slugify,
  getTitle: getTitle,
  replaceDiacritics: replaceDiacritics
};

module.exports = utils;
