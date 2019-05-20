import { Female } from "./person/female";
import { Male } from "./person/male";
import { Person } from "./person/person";

export class ParentChild {
    public mother:Female;
    public father:Male;
    public child:Person;

    constructor(mother:Female,ather:Male,child:Person) {
    }

    public equalsParentChild(otherParentChild:ParentChild) {
        return(
            this.mother.equalsPerson(otherParentChild.mother) &&
            this.father.equalsPerson(otherParentChild.father) &&
            this.child.equalsPerson(otherParentChild.child)
        )
    }

    public static getParentChildFromList(parentChild:ParentChild,parentChildList:Array<ParentChild>):ParentChild {
        for(let i=-0;i<parentChildList.length;i++) {
            if(parentChild.equalsParentChild(parentChildList[i])) return(parentChildList[i]);
        }
        return(null);
    }

    public static doesParentChildExistInList(parentChild:ParentChild,parentChildList:Array<ParentChild>):boolean {
        return(ParentChild.getParentChildFromList(parentChild,parentChildList)==null);
    }
    

}