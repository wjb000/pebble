import { useSim } from '../sim/SimContext'

export function TrainPanel() {
  const {
    state,
    train,
    setRecording,
    clearTrajectory,
    downloadTrajectory,
    trainPolicy,
    runPolicy,
    stopPolicy,
    clearPolicy,
    downloadPolicyFile,
    setMode,
  } = useSim()

  const testing = state.mode === 'policy'

  return (
    <div className="hud-box hud-train" role="region" aria-label="AI train">
      <div className="hud-label">AI TRAIN / TEST</div>
      <div className="hud-row">
        samples {train.sampleCount}
        {train.recording ? ' · REC' : ' · paused'}
      </div>
      {train.policyReady && (
        <div className="hud-row">
          policy ep {train.epochs} · loss {train.loss.toFixed(3)}
        </div>
      )}
      <div className="train-actions">
        <button type="button" onClick={() => setMode('teleop')}>Teleop</button>
        <button type="button" onClick={() => setRecording(!train.recording)}>
          {train.recording ? 'Pause rec' : 'Record'}
        </button>
        <button type="button" onClick={() => trainPolicy(30)}>Train BC</button>
        <button
          type="button"
          className={testing ? 'train-on' : ''}
          onClick={() => (testing ? stopPolicy() : runPolicy())}
          disabled={!train.policyReady && !testing}
        >
          {testing ? 'Stop AI' : 'Test AI'}
        </button>
      </div>
      <div className="train-actions">
        <button type="button" onClick={downloadTrajectory}>Dump traj</button>
        <button type="button" onClick={downloadPolicyFile} disabled={!train.policyReady}>Dump policy</button>
        <button type="button" onClick={clearTrajectory}>Clear traj</button>
        <button type="button" onClick={clearPolicy}>Clear AI</button>
      </div>
      <div className="train-msg">{train.lastReport}</div>
    </div>
  )
}
