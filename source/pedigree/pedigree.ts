/**
 * A pedigree as a list of people plus a list of trios ("triplets"):
 * each trio says "this child has this mother and this father".
 *
 * Everything else - couples, sibships, generations - is derived from the
 * trios, so a couple only exists once they share a child.
 */

export type Sex = "male" | "female" | "unknown";

export interface Person {
    id: string;
    name: string;
    sex: Sex;
    age: number | null;
    deceased: boolean;
    proband: boolean;
}

export interface Trio {
    childId: string;
    motherId: string;
    fatherId: string;
}

export interface PedigreeData {
    people: Person[];
    trios: Trio[];
}

export interface Couple {
    motherId: string;
    fatherId: string;
    childIds: string[];
}

export class Pedigree {
    public people: Person[] = [];
    public trios: Trio[] = [];
    private nextId = 1;

    // ---- lookups ----------------------------------------------------------

    public get(id: string): Person {
        const p = this.people.find(p => p.id === id);
        if (!p) throw new Error("No person with id " + id);
        return p;
    }

    public find(id: string | null | undefined): Person | undefined {
        return id ? this.people.find(p => p.id === id) : undefined;
    }

    /** The trio in which this person is the child, if any. */
    public parentsOf(id: string): Trio | undefined {
        return this.trios.find(t => t.childId === id);
    }

    /** Everyone this person has had a child with. */
    public partnersOf(id: string): string[] {
        const partners = new Set<string>();
        for (const t of this.trios) {
            if (t.motherId === id) partners.add(t.fatherId);
            if (t.fatherId === id) partners.add(t.motherId);
        }
        return [...partners];
    }

    public childrenOf(id: string, partnerId?: string): string[] {
        return this.trios
            .filter(t => (t.motherId === id || t.fatherId === id) &&
                (!partnerId || t.motherId === partnerId || t.fatherId === partnerId))
            .map(t => t.childId);
    }

    /** Full siblings: same mother and father. */
    public siblingsOf(id: string): string[] {
        const mine = this.parentsOf(id);
        if (!mine) return [];
        return this.trios
            .filter(t => t.childId !== id && t.motherId === mine.motherId && t.fatherId === mine.fatherId)
            .map(t => t.childId);
    }

    /** Each mother/father pair that appears in a trio, with their children. */
    public couples(): Couple[] {
        const byKey = new Map<string, Couple>();
        for (const t of this.trios) {
            const key = t.motherId + "|" + t.fatherId;
            let c = byKey.get(key);
            if (!c) byKey.set(key, c = { motherId: t.motherId, fatherId: t.fatherId, childIds: [] });
            c.childIds.push(t.childId);
        }
        return [...byKey.values()];
    }

    /**
     * Generation number for everyone (0 = top row). Children sit one below
     * their lower parent, and partners share a row.
     */
    public generations(): Map<string, number> {
        const gen = new Map<string, number>(this.people.map(p => [p.id, 0]));
        for (let pass = 0; pass < this.people.length * 2 + 2; pass++) {
            let changed = false;
            const bump = (id: string, g: number) => {
                if ((gen.get(id) ?? 0) < g) { gen.set(id, g); changed = true; }
            };
            for (const t of this.trios) {
                const parentGen = Math.max(gen.get(t.motherId) ?? 0, gen.get(t.fatherId) ?? 0);
                bump(t.motherId, parentGen);
                bump(t.fatherId, parentGen);
                bump(t.childId, parentGen + 1);
            }
            if (!changed) break;
        }
        return gen;
    }

    // ---- edits -----------------------------------------------------------

    public addPerson(fields: Partial<Omit<Person, "id">> = {}): Person {
        const person: Person = {
            id: "p" + this.nextId++,
            name: fields.name ?? "",
            sex: fields.sex ?? "unknown",
            age: fields.age ?? null,
            deceased: fields.deceased ?? false,
            proband: false,
        };
        this.people.push(person);
        if (fields.proband) this.setProband(person.id);
        return this.people[this.people.length - 1];
    }

    /** Give someone a new mother and father. */
    public addParents(childId: string): Trio {
        if (this.parentsOf(childId)) throw new Error(this.label(childId) + " already has parents");
        const mother = this.addPerson({ sex: "female" });
        const father = this.addPerson({ sex: "male" });
        const trio = { childId, motherId: mother.id, fatherId: father.id };
        this.trios.push(trio);
        return trio;
    }

    /**
     * Add a child of `parentId` with `partnerId` (or with a new partner of
     * the opposite sex when partnerId is null).
     */
    public addChild(parentId: string, partnerId: string | null, sex: Sex): Person {
        const parent = this.get(parentId);
        const partner = partnerId ? this.get(partnerId)
            : this.addPerson({ sex: parent.sex === "male" ? "female" : parent.sex === "female" ? "male" : "unknown" });
        const child = this.addPerson({ sex });
        this.trios.push({ childId: child.id, ...this.motherAndFather(parent, partner) });
        return child;
    }

    /** Add a full sibling, creating parents first if needed. */
    public addSibling(id: string, sex: Sex): Person {
        const trio = this.parentsOf(id) ?? this.addParents(id);
        const sibling = this.addPerson({ sex });
        this.trios.push({ childId: sibling.id, motherId: trio.motherId, fatherId: trio.fatherId });
        return sibling;
    }

    /** Remove someone. People with children can't be removed (it would break the trios). */
    public remove(id: string): void {
        if (this.childrenOf(id).length) throw new Error("Remove " + this.label(id) + "'s children first");
        this.trios = this.trios.filter(t => t.childId !== id);
        this.people = this.people.filter(p => p.id !== id);
    }

    public setSex(id: string, sex: Sex): void {
        this.get(id).sex = sex;
        // keep the mother slot for the female partner where we can
        for (const t of this.trios) {
            const m = this.get(t.motherId), f = this.get(t.fatherId);
            if (m.sex === "male" || f.sex === "female") Object.assign(t, this.motherAndFather(m, f));
        }
    }

    public setProband(id: string | null): void {
        for (const p of this.people) p.proband = p.id === id;
    }

    public clear(): void {
        this.people = [];
        this.trios = [];
        this.nextId = 1;
    }

    public label(id: string): string {
        const p = this.find(id);
        return p ? (p.name || "Unnamed " + (p.sex === "male" ? "male" : p.sex === "female" ? "female" : "person")) : id;
    }

    private motherAndFather(a: Person, b: Person): { motherId: string, fatherId: string } {
        if (a.sex === "male" || b.sex === "female") return { motherId: b.id, fatherId: a.id };
        return { motherId: a.id, fatherId: b.id };
    }

    // ---- serialisation ---------------------------------------------------

    public toJSON(): PedigreeData {
        return { people: this.people.map(p => ({ ...p })), trios: this.trios.map(t => ({ ...t })) };
    }

    public load(data: PedigreeData): void {
        const ids = new Set(data.people.map(p => p.id));
        for (const t of data.trios)
            for (const id of [t.childId, t.motherId, t.fatherId])
                if (!ids.has(id)) throw new Error("Trio refers to unknown person " + id);
        this.people = data.people.map(p => ({ ...p }));
        this.trios = data.trios.map(t => ({ ...t }));
        this.nextId = 1 + Math.max(0, ...this.people.map(p => Number(p.id.replace(/\D/g, "")) || 0));
    }

    /** A small three-generation family to start from. */
    public loadExample(): void {
        this.clear();
        const add = (name: string, sex: Sex, age: number, deceased = false) => this.addPerson({ name, sex, age, deceased });
        const gf = add("George", "male", 88, true), gm = add("Edith", "female", 84);
        const mf = add("Walter", "male", 79, true), mm = add("Ruth", "female", 77, true);
        const dad = add("Tom", "male", 56), aunt = add("Anne", "female", 52), mum = add("Mary", "female", 54);
        const uncle = add("Paul", "male", 50);
        const me = add("Sam", "female", 28), bro = add("Ben", "male", 25), cousin = add("Lucy", "female", 19);
        const trio = (c: Person, m: Person, f: Person) => this.trios.push({ childId: c.id, motherId: m.id, fatherId: f.id });
        trio(dad, gm, gf); trio(aunt, gm, gf);
        trio(mum, mm, mf); trio(uncle, mm, mf);
        trio(me, mum, dad); trio(bro, mum, dad);
        const auntsHusband = add("Mark", "male", 53);
        trio(cousin, aunt, auntsHusband);
        this.setProband(me.id);
    }
}
