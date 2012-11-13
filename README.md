
# jQuery.validator

Licence: <b>Apache License, Version 2.0</b><br />
Demo: http://dev.maxschuster.eu/Validator/

Client-Side Form Input validation jQuery Plugin.

# Documentation

## Methods

### init
Initializes the validator plugin on the given set of jQuery elements with the given set of options

#### Usage:
```JavaScript
$('selector').validator(options);
```
#### Parameters:
<table>
    <tr>
        <th>Parameter</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>options</td>
        <td>Object</td>
        <td>Settings with which the plugin should be initialized (see Settings)</td>
    </tr>
</table>

#### Returns:
<b>jQuery Object</b> <i>To provide chainability.</i>

<hr />

### valid
Checks if every matching element (that has jQuery.validator initialized on it) has a valid value.

#### Usage:
```JavaScript
$('selector').validator('valid');
```

#### Parameters:
none

#### Returns:
<b>Boolean</b> <i>True if all elements are valid or false if not.</i>

<hr />

### enable
Enables the form checking for the given set of jQuery elements.

#### Usage:
```JavaScript
$('selector').validator('enable');
```

#### Parameters:
none

#### Returns:
<b>jQuery Object</b> <i>To provide chainability.</i>

<hr />

### disable
Disables the form checking for the given set of jQuery elements.

#### Usage:
```JavaScript
$('selector').validator('disable');
```

#### Parameters:
none

#### Returns:
<b>jQuery Object</b> <i>To provide chainability.</i>

<hr />

### destroy
Completely removes the form checking for the given set of jQuery elements.

#### Usage:
```JavaScript
$('selector').validator('destroy');
```

#### Parameters:
none

#### Returns:
<b>jQuery Object</b> <i>To provide chainability.</i>


## Options
<table>
<tr>
<th>Name</th>
<th>Type</th>
<th>Default</th>
<th>Description</th>
</tr>
<tr>
<td>ajax</td>
<td>String | Boolean</td>
<td>false</td>
<td>
Url of the ajax file. File has to return true or false as json.
</td>
</tr>
<tr>
<td>liveCheck</td>
<td>Boolean</td>
<td>false</td>
<td>
If true the check will be triggred on every keydown, keyup, keypress, change and blur event. If it is false the check will only be executed of every change and blur event.
</td>
</tr>
<tr>
<td>mask</td>
<td>String | RegExp</td>
<td>'required'</td>
<td>
The regular expression which the contents of the input will be matched against is. Can be a self-defined regular expression or the name of a predefined expression (eg email).
</td>
</tr>
<tr>
<td>optional</td>
<td>Boolean</td>
<td>false</td>
<td>If true then the value could be empty.</td>
</tr>
<tr>
<td>rel</td>
<td>jQuery Object | Boolean</td>
<td>false</td>
<td>
Defines that the current element is related to another element and must have the same value. Used for "Retype Password" fields.
</td>
</tr>
<tr>
<td>predefinedMasks</td>
<td>Object</td>
<td>{'email': ..., ...}</td>
<td>Contains predefined regex mask with their name as key. (See predefinedMasks)</td>
</tr>
</table>

## predefinedMasks
<table>
<tr>
<th>
Name
</th>
<th>
Description
</th>
</tr>
<tr>
<td>
email
</td>
<td>
Value must match the email format
</td>
</tr>
<tr>
<td>
required
</td>
<td>
The value must not be empty
</td>
</tr>
<tr>
<td>
zip_code_ger_and_at
</td>
<td>
The value must match the german or austrian zip code format
</td>
</tr>
<tr>
<td>
no_white_space
</td>
<td>
The value must not contain whitespaces
</td>
</tr>
<tr>
<td>
number
</td>
<td>
The value must be a number "." and "," allowed.
</td>
</tr>
<tr>
<td>
integer
</td>
<td>
The value must be an integer.
</td>
</tr>
<tr>
<td>
date_day_month_year
</td>
<td>
Date in the format D(D).M(M).YYYY.
</td>
</tr>
<tr>
<td>
date_year_month_day
</td>
<td>
Date in the format YYYY-MM-DD.
</td>
</tr>
</table>

More suggestions are allways welcome... ;-)

## Events

### valid.validator

Gets triggered if the value of the input has become valid.

### invalid.validator

Gets triggered if the value of the input has become invalid.

### checkedvalue.validator

Gets triggered if the current value of the input has been checked.

## Style Classes

### validator

Added to every element that has jQuery.validator attached.

### validator-invalid

Added to every element that has an invalid value.