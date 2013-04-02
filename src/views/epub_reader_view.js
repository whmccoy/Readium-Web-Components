EpubReader.EpubReaderView = Backbone.View.extend({

    initialize : function (options) {

        // Initialize the spine info thing, or whatever it's going to be called
        var currSpineIndex = 0;
        this.reader = new EpubReader.EpubReader({
            spineInfo : options.spineInfo,
            viewerSettings : options.viewerSettings,
            parentElement : options.readerElement
        });
        this.readerBoundElement = options.readerElement;
    },

    render : function () {

        // Set the element that this view will be bound to
        this.setElement(this.readerBoundElement);
        return this.el;
    },

    // ---- Public interface ------------------------------------------------------------------------

    // REFACTORING CANDIDATE: This will only work for reflowable page views; there is currently not a mapping between
    //   spine items and the page views in which they are rendered, for FXL epubs. When support for FXL is included, this 
    //   abstraction will include more.
    showSpineItem : function (spineIndex) {

        this.reader.renderPagesView(spineIndex, false, undefined);
    },

    // Rationale: As with the CFI library API, it is up to calling code to ensure that the content document CFI component is
    //   is a reference into the content document pointed to by the supplied spine index. 
    showPageByCFI : function (spineIndex, contentDocumentCFIComponent) {

        this.showSpineItem(spineIndex);

        // Show the element by passing the CFI fragment to the current view
    },

    showPageByElementId : function (spineIndex, elementId) { 

        // Rationale: Try to locate the element before switching to a new page view try/catch
        this.reader.getCurrentPagesView().goToHashFragment(elementId);
        this.showSpineItem(spineIndex);
    },

    nextPage : function () {

        var currentPagesView = this.reader.getCurrentPagesView();
        if (currentPagesView.onLastPage()) {
            this.reader.renderNextPagesView();
        }
        else {
            currentPagesView.nextPage();
        }
    },

    previousPage : function () {

        var currentPagesView = this.reader.getCurrentPagesView();
        if (currentPagesView.onFirstPage()) {
            this.reader.renderPreviousPagesView();
        }
        else {
            currentPagesView.previousPage();
        }
    },

    // REFACTORING CANDIDATE: I don't like that we're maintaining viewer state in the epub object; better that
    //   each time a view was shown, the settings are applied if required

    setFontSize : function (fontSize) {

        var currentView = this.reader.getCurrentPagesView();
        currentView.setFontSize(fontSize);
        this.reader.get("viewerSettings").fontSize = fontSize;
    },

    setMargin : function (margin) {

        var currentView = this.reader.getCurrentPagesView();
        currentView.setMargin(margin);
        this.reader.get("viewerSettings").currentMargin = margin;
    },

    setTheme : function (theme) {

        var currentView = this.reader.getCurrentPagesView();
        currentView.setTheme(theme);
        this.reader.get("viewerSettings").currentTheme = theme
    },

    setSyntheticLayout : function (isSynthetic) {

        var currentView = this.reader.getCurrentPagesView();
        currentView.setSyntheticLayout(isSynthetic);
        this.reader.get("viewerSettings").syntheticLayout = isSynthetic;
    },

    getNumberOfPages : function () {

        return this.reader.calculatePageNumberInfo().numPages;
    },

    getCurrentPage : function () {

        return this.reader.calculatePageNumberInfo().currentPage;
    },

    // ----------------------- Private Helpers -----------------------------------------------------------
    
});