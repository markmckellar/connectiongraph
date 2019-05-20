
export class Person {
    public sex:Sex;
    public proband:boolean;
    public personId:number;

    constructor(sex:Sex) {
        this.sex = sex;
        this.proband = false;
        this.personId = 0;
    }

    public equalsPerson(otherPerson:Person) {
        return(this.personId==otherPerson.personId);
    }

}