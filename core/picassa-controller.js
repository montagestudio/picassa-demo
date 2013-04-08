var Montage = require("montage").Montage;

exports.PicassaController = Montage.create(Montage, {

    resultCount: {
        value: 10
    },

    searchTerm: {
        value: ""
    },

    _photos: {
        value: null
    },

    photos: {
        get: function () {
            return this._photos;
        }
    },

    didCreate: {
        value: function () {
            this.addPathChangeListener("resultCount", this, "handleSearchCriteriaChange");
            this.addPathChangeListener("searchTerm", this, "handleSearchCriteriaChange");
        }
    },

    handleSearchCriteriaChange: {
        value: function () {
            this.performSearch();
        }
    },

    _latestRequest: {
        value: null
    },

    performSearch: {
        value: function() {
            var base = "http://picasaweb.google.com/data/feed/base/";
                base = base + "all?visibility=public&alt=json&max-results=" + this.resultCount + "&kind=photo&prettyprint=true&imgmax=720u&q=";
            var url = base + this.searchTerm;

            var req = this._latestRequest = new XMLHttpRequest();
            req.identifier = "searchRequest";
            req.open("GET", url);
            req.addEventListener("load", this, false);
            req.addEventListener("error", this, false);
            req.send();
        }
    },

    handleSearchRequestLoad: {
        value: function(evt) {
            if (evt.target === this._latestRequest) {
                var response = JSON.parse(evt.target.responseText);
                this.dispatchBeforeOwnPropertyChange("photos", this.photos);
                this._photos = response.feed.entry;
                console.log(this._photos)
                this.dispatchOwnPropertyChange("photos", this.photos);
            }
        }
    },

    handleSearchRequestError: {
        value: function(evt) {
            if (evt.target === this._latestRequest) {
                console.error("handleSearchRequestError", evt);
            }
        }
    }
});
