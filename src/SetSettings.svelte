<script>
export let settings
</script>

<h3>Quiz settings</h3>

<label class="block mts">Ignore case <input bind:checked={settings.icase} type="checkbox"></label>
<label class="block">Ignore whitespace <input bind:checked={settings.iwhitespace} type="checkbox"></label>
<label class="block">Ignore punctuation (.,!?) <input bind:checked={settings.ipunctuation} type="checkbox"></label>
