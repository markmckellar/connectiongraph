import { ParentChild } from "./parentchild";
import { Person } from "./person/person";

export class Pedigree {
    public trips:Array<ParentChild>;
    public proband:Person;
    private people:Array<Person>;
    private personIdMap:Map<number,Person>;

    

    constructor(parentChild:ParentChild) {
        this.trips = new Array<ParentChild>();
        this.people = new Array<Person>();
        this.personIdMap = new Map<number,Person>();


        this.addParentChild(parentChild);
    }

    public addParentChild(parentChild:ParentChild):void {
        if(!this.trips.length) {
            parentChild.child.proband = true;
            this.proband = parentChild.child;
        }
        if(this.doesParentChildExist(parentChild)) throw new Error("parentChild already exists");

        if(this.doesPersonExist(parentChild.mother)) this.addPerson(parentChild.mother);
        if(this.doesPersonExist(parentChild.father)) this.addPerson(parentChild.father);
        if(this.doesPersonExist(parentChild.child)) this.addPerson(parentChild.child);
        this.trips.push(parentChild);
    }

    public getLastPesronId():number {
        return(this.people.length);
    }

    private addPerson(person:Person):void {
        person.personId = this.getLastPesronId()+1;
        this.personIdMap.set(person.personId,person);
        this.people.push(person);
    }

    public getPersonById(personId:number) {
        let person = (this.personIdMap.has(personId)) 
            ? this.personIdMap.get(personId)
            : null;
        return(person);
    }

    public doesParentChildExist(parentChild:ParentChild):boolean {
        return(ParentChild.doesParentChildExistInList(parentChild,this.trips));
    }

    public doesPersonExist(person:Person):boolean {
        return( this.getPersonById(person.personId) == null);
    }

    public getPeople():Array<Person> {
        return(this.people);
    }




}