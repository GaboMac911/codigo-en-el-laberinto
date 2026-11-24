import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

type View = 'inicio' | 'ruta' | 'retos' | 'laboratorio' | 'recursos';
type ChallengeId = 'patrones' | 'secuencia' | 'abstraccion';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly view = signal<View>('inicio');
  protected readonly activeModule = signal(1);
  protected readonly completed = signal<string[]>(this.readProgress());
  private readonly storedProject = this.readProject();
  protected readonly selectedPattern = signal<number | null>(null);
  protected readonly patternChecked = signal(false);
  protected readonly sequence = signal<string[]>([]);
  protected readonly sequenceChecked = signal(false);
  protected readonly abstractionAnswer = signal('');
  protected readonly abstractionChecked = signal(false);
  protected readonly projectGoal = signal(this.storedProject.goal);
  protected readonly projectPlan = signal(this.storedProject.plan);
  protected readonly projectTest = signal(this.storedProject.test);
  protected readonly projectReflection = signal(this.storedProject.reflection);
  protected readonly projectSaved = signal(this.storedProject.saved);
  protected readonly unitsCompleted = computed(() => this.completed().filter((key) => /^module-[1-4]$/.test(key)).length);
  protected readonly percent = computed(() => Math.round((this.unitsCompleted() / 4) * 100));
  protected readonly modules = [
    { id: 1, icon: '🧭', title: 'Entiendo el reto', topic: 'Comprender y descomponer', sessions: '2 sesiones · 30 min', color: 'lilac', task: 'Comprende la meta y los datos disponibles. Actividad desconectada: guía a tu pareja por una cuadrícula con instrucciones precisas; después divide la misión en partes pequeñas.', evidence: 'Cuadrícula resuelta y algoritmo escrito en pasos.', check: 'Lista de cotejo: ¿explica la meta?, ¿separa el reto?, ¿sus instrucciones son claras?' },
    { id: 2, icon: '🔎', title: 'Encuentro las pistas', topic: 'Patrones y abstracción', sessions: '2 sesiones · 40 min', color: 'mint', task: 'Compara ejemplos para encontrar una regla y distingue los datos que sí importan. Actividad desconectada: clasifica tarjetas de figuras y explica el patrón antes de jugar en el acuario.', evidence: 'Regla explicada y predicción justificada.', check: 'Autoevaluación: describe la regla y señala qué dato usó como pista.' },
    { id: 3, icon: '🧩', title: 'Diseño y pruebo un plan', topic: 'Algoritmos, secuencias y depuración', sessions: '2 sesiones · 45 min', color: 'peach', task: 'Escribe pasos ordenados, ejecútalos, verifica el resultado y corrige los errores. Usa el laberinto para explorar cómo cambian los resultados al ajustar tu secuencia.', evidence: 'Secuencia probada con registro de un error y su ajuste.', check: 'Coevaluación en parejas: prueben las instrucciones y comenten un paso que se pueda mejorar.' },
    { id: 4, icon: '🌟', title: 'Resuelvo una misión', topic: 'Reto integrador y reflexión', sessions: '2 sesiones · 55 min', color: 'blue', task: 'Diseña en equipo una solución para un reto elegido. Presenta la meta, el patrón que encontraste, tu algoritmo y una mejora que hiciste tras probarlo.', evidence: 'Miniproyecto explicado con plan, prueba y reflexión.', check: 'Rúbrica de cuatro criterios + reflexión individual sobre la estrategia.' },
  ];
  protected readonly games = [
    { key: 'maze', title: 'El tesoro del laberinto', label: 'Razonamiento espacial', description: 'Recoge las pistas evitando los charcos. Planea cada movimiento: el globo solo se detiene al chocar con una pared.', src: 'https://arcade.makecode.com/---codeembed#pub:S90810-67666-80935-36996', icon: '🗺️', color: 'lilac' },
    { key: 'fish', title: 'El acuario de los patrones', label: 'Patrones y decisiones', description: 'Recoge perlas mientras observas al tiburón. Decide qué ruta te conviene antes de que se acabe el tiempo.', src: 'https://arcade.makecode.com/---codeembed#pub:S46790-11832-35410-12435', icon: '🐠', color: 'mint' },
    { key: 'escape', title: 'Escape room: misión secreta', label: 'Lógica y resolución de problemas', description: 'Sigue las instrucciones, reúne objetos y resuelve acertijos para encontrar la salida.', src: 'https://scratch.mit.edu/projects/1393517445/embed', icon: '🔐', color: 'peach' },
  ];
  protected readonly patternOptions = [
    { icon: '🔺', name: 'Triángulo' }, { icon: '🟣', name: 'Círculo' }, { icon: '🔺', name: 'Triángulo' }, { icon: '🟣', name: 'Círculo' },
  ];
  protected readonly sequenceSteps = [
    { id: 'meta', text: 'Definir qué cuenta como llegar a la meta.' },
    { id: 'plan', text: 'Elegir una ruta y planear los movimientos.' },
    { id: 'prueba', text: 'Probar la secuencia y observar el resultado.' },
    { id: 'ajuste', text: 'Corregir el plan si aparece un obstáculo.' },
  ];

  protected selectView(view: View): void { this.view.set(view); }
  protected selectModule(id: number): void { this.activeModule.set(id); this.view.set('ruta'); }
  protected moduleDone(id: number): boolean { return this.completed().includes(`module-${id}`); }
  protected markModule(id: number): void { this.saveProgress(`module-${id}`); }
  protected isDone(key: string): boolean { return this.completed().includes(key); }
  protected selectPattern(index: number): void { this.selectedPattern.set(index); this.patternChecked.set(false); }
  protected checkPattern(): void { this.patternChecked.set(true); if (this.selectedPattern() === 0) this.saveProgress('challenge-patrones'); }
  protected addSequenceStep(id: string): void {
    if (!this.sequence().includes(id)) { this.sequence.update((steps) => [...steps, id]); this.sequenceChecked.set(false); }
  }
  protected checkSequence(): void {
    this.sequenceChecked.set(true);
    if (this.sequence().join(',') === 'meta,plan,prueba,ajuste') this.saveProgress('challenge-secuencia');
  }
  protected checkAbstraction(): void {
    this.abstractionChecked.set(true);
    if (this.abstractionAnswer().trim().toLowerCase() === 'pared') this.saveProgress('challenge-abstraccion');
  }
  protected saveProject(): void {
    if (this.projectGoal().trim() && this.projectPlan().trim() && this.projectTest().trim() && this.projectReflection().trim()) {
      this.saveProgress('module-4'); this.projectSaved.set(true);
      if (typeof window !== 'undefined') window.localStorage.setItem('proyecto-final-pc', JSON.stringify({ goal: this.projectGoal(), plan: this.projectPlan(), test: this.projectTest(), reflection: this.projectReflection() }));
    }
  }
  protected resetSequence(): void { this.sequence.set([]); this.sequenceChecked.set(false); }
  protected saveProgress(key: string): void {
    if (!this.completed().includes(key)) {
      const updated = [...this.completed(), key]; this.completed.set(updated);
      if (typeof window !== 'undefined') window.localStorage.setItem('ruta-pc-grado9', JSON.stringify(updated));
    }
  }
  private readProgress(): string[] {
    if (typeof window === 'undefined') return [];
    try { const value: unknown = JSON.parse(window.localStorage.getItem('ruta-pc-grado9') ?? '[]'); return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : []; }
    catch { return []; }
  }
  private readProject(): { goal: string; plan: string; test: string; reflection: string; saved: boolean } {
    if (typeof window === 'undefined') return { goal: '', plan: '', test: '', reflection: '', saved: false };
    try {
      const value: unknown = JSON.parse(window.localStorage.getItem('proyecto-final-pc') ?? 'null');
      if (!value || typeof value !== 'object') return { goal: '', plan: '', test: '', reflection: '', saved: false };
      const project = value as Record<string, unknown>;
      return {
        goal: typeof project['goal'] === 'string' ? project['goal'] : '',
        plan: typeof project['plan'] === 'string' ? project['plan'] : '',
        test: typeof project['test'] === 'string' ? project['test'] : '',
        reflection: typeof project['reflection'] === 'string' ? project['reflection'] : '',
        saved: true,
      };
    } catch { return { goal: '', plan: '', test: '', reflection: '', saved: false }; }
  }
}
