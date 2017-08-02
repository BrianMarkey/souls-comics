export default {
  /// Specifies if a value is an integer
  /// including string representations of integers.
  isInt: function(value) {
    if (isNaN(value)) {
      return false;
    }
    var x = parseFloat(value);
    return (x | 0) === x;
  }
};
