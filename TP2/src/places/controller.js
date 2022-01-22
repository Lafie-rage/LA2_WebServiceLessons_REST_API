
const Validator = require('jsonschema').Validator;

class Places {
    constructor(data) {
        this.data = data;
    }

    configure(app) {
        const data = this.data;

        app.get("/api/places/:id", async (request, response) => {
            response.setHeader('Access-Control-Allow-Origin', "http://localhost:3000") // On authorize les requêtes en cross origin pour le client react seulement
            let id = request.params.id;
            const place = await data.getPlaceAsync(id);
            if (place !== undefined) {
                response.status(200).json(place);
                return;
            }
            response.status(404).json({key: "entity.not.found"});
        });

        app.get("/api/places", async (request, response) => {
            response.setHeader('Access-Control-Allow-Origin', "http://localhost:3000") // On authorize les requêtes en cross origin pour le client react seulement
            response.setHeader('Access-Control-Allow-Methods', "GET")
            response.setHeader('Access-Control-Allow-Headers', "Accept, Api-version")
            const places = await data.getPlacesAsync();
            if (places !== undefined) {
                response.status(200).json(places);
                return;
            }
            response.status(400).json({key: "Unknown error"});
        })

        app.post("/api/places", async (request, response) => {
            const place = request.body
            const fieldValidator = "^([A-z]|-| ){3,100}$"; // Between 3 to 100 charactères. Only letters in upper or lower case, - and spaces.
            // Find on https://stackoverflow.com/a/17773849
            const urlValidators = "(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})"
            const validator = new Validator();
            const placeObjectSchema = {
                "id": "/Place",
                "type": "object",
                "properties": {
                    "image": {
                        "type": ["object", "null"],
                        "properties": {
                            "url": {"type": "string", pattern: urlValidators}, // Already define text should be between 3 and 100 characters
                            "title": {"type": "string", "minLength": 3, "maxLength": 100, pattern: fieldValidator}
                        },
                        "required": ["url", "title"],
                        "nullable": true,
                    },
                    "author": {"type": "string", pattern: fieldValidator}, // Already define text should be between 3 and 100 characters
                    "review": {"type": "integer", "minimum": 1, "maximum": 9},
                    "name": {"type": "string", pattern: fieldValidator}, // Already define text should be between 3 and 100 characters
                },
                "required": ["author", "review", "name"]
            };

            const validate = validator.validate(place, placeObjectSchema);
            if(!validate.valid) {
                response.status(400).json({key: "Data.not.match.rules", error: validate.errors})
                return;
            }

            const createdPlaceId = await data.savePlaceAsync(place);
            response.setHeader(
                'Location',
                "http://localhost:8081/api/places/" + createdPlaceId
            )
            response.status(201).json();
        })

        app.delete("/api/places/:id", async (request, response) => {
            const placeId = request.params.id
            if(placeId === undefined) {
                response.status(400).json({key: "No.id.transmitted"})
                return;
            }

            if(await data.deletePlaceAsync(placeId)) {
                response.status(200).json({status: "OK"})
                return;
            }
            response.status(404).json({key: "Entity.not.found", status: "NOT FOUND"});
        })
    }
}

module.exports = Places;
