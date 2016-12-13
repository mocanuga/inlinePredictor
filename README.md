# inlinePredictor
Javascript inline autocomplete script

Very simple to use autocomplete script.
It is not like your traditional, list under textbox, autocomplete script.
It is prediction type autocomplete script. It will predict the remaining letters
of what you are typing and it updates itself if you type characters not in the original
prediction.

It uses a simple service to get the predictions.

## Usage:
```javascript
<script type="type/javascript" src="predictor.js"></script>
<script type="text/javascript">
  var predictable = document.querySelector('input[name="q"]');
  predict.bind(predictable, {
    service: 'predictions.json'
  });
</script>
```
You can use it for filter fields such as usernames, emails, addresses, phone numbers and many others.

## Supported browsers
All modern pc, phone or tablet browsers.
If you see that the script on your device is not working, 
please report the issue in the issues tab.

Thanks.
