function LanguageSwitcher({
  language,
  setLanguage,
}) {

  return (

    <div className="languageSwitcher">

      <label>
        🌐 Language
      </label>

      <select
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value)
        }
      >
        <option value="english">
          English
        </option>

        <option value="hindi">
          हिन्दी
        </option>

      </select>

    </div>

  );

}

export default LanguageSwitcher;