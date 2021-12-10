class Places {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    const data = this.data;

    app.get("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        response.status(200).json(place);
        return;
      }
      response.status(404).json({key: "entity.not.found"});
    });

    app.get("/api/places", async (request, response) => {
      const places = await data.getPlacesAsync();
      if(places !== undefined) {
        response.status(200).json(places);
        return;
      }
      response.status(400).json({key: "Unknown error"});
    })

    api.post("/api/places", async (place, response) => {
      const fieldValidators = "^([A-z]|-){3,100}$";
      if(place.name !== undefined && place.name.match(fieldValidators)) {
        response.status(400).json({key: "Name.not.match.rules"});
        return;
      }
      if(place.author !== undefined && place.author.match(fieldValidators)) {
        response.status(400).json({key: "Author.not.match.rules"});
        return;
      }
      // Test image URL defined
      // Test image title defined + match si URL defined
      // Test review exist, isInt & 0 <= review <= 9
      savePlaceAsync(place)
    })

  }
}
module.exports = Places;
