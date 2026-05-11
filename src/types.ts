export type ActorType = 'Individual' | 'Government' | 'InternationalOrganization' | 'Other';
export type RelationType = 'Diplomacy' | 'Conflict' | 'Agreement' | 'Other';

export interface Actor {
  id: string;
  name: string;
  type: ActorType;
  description?: string;
}

export interface Relation {
  source: string;
  target: string;
  type: RelationType;
  description?: string;
}

export interface AnalysisResult {
  actors: Actor[];
  relations: Relation[];
}
