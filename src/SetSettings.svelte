<script>
export let settings
</script>

<label class="block mt">Ignore case <input bind:checked={settings.icase} type="checkbox"></label>
<label class="block">Ignore whitespace <input bind:checked={settings.iwhitespace} type="checkbox"></label>
<label class="block">Ignore punctuation (.,!?) <input bind:checked={settings.ipunctuation} type="checkbox"></label>

