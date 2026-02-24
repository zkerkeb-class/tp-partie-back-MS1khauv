
import express from 'express';
import cors from 'cors';
import pokemon from './schema/pokemon.js';

import './connect.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// GET tous les pokemons avec pagination (20 par page)
// Exemple : GET /pokemons?page=1
app.get('/pokemons', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const total = await pokemon.countDocuments();
        const pokemons = await pokemon.find({}).skip(skip).limit(limit);

        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            totalPokemons: total,
            pokemons,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET un pokemon par nom (recherche insensible à la casse)
// Exemple : GET /pokemons/search?name=bulbasaur
app.get('/pokemons/search', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Le paramètre "name" est requis' });
        }

        const poke = await pokemon.findOne({
            'name.english': { $regex: new RegExp(name, 'i') }
        });

        if (!poke) {
            return res.status(404).json({ error: 'Pokemon non trouvé' });
        }

        res.json(poke);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET un pokemon par id
// Exemple : GET /pokemons/1
app.get('/pokemons/:id', async (req, res) => {
    try {
        const poke = await pokemon.findOne({ id: req.params.id });
        if (!poke) {
            return res.status(404).json({ error: 'Pokemon non trouvé' });
        }
        res.json(poke);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST créer un nouveau pokemon
// Body JSON requis : { id, name: { english, japanese, chinese, french }, type, base: { HP, Attack, Defense, SpecialAttack, SpecialDefense, Speed }, image }
app.post('/pokemons', async (req, res) => {
    try {
        const newPokemon = new pokemon(req.body);
        const saved = await newPokemon.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT modifier un pokemon existant par id
// Exemple : PUT /pokemons/1
app.put('/pokemons/:id', async (req, res) => {
    try {
        const updated = await pokemon.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Pokemon non trouvé' });
        }

        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE supprimer un pokemon par id
// Exemple : DELETE /pokemons/1
app.delete('/pokemons/:id', async (req, res) => {
    try {
        const deleted = await pokemon.findOneAndDelete({ id: req.params.id });

        if (!deleted) {
            return res.status(404).json({ error: 'Pokemon non trouvé' });
        }

        res.json({ message: `Pokemon "${deleted.name.english}" supprimé avec succès` });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
